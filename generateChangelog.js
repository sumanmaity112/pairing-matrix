const childProcess = require("child_process");
const fs = require("fs");
const packageJson = require("./packages/server/package.json");
const currentVersion = packageJson.version;

const changeLogHeader = `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
`;

const delimiter = `----DELIMITER----`;

const commitTypesToConsider = {
  "feat!": { description: "⚠ BREAKING CHANGES", priority: 0 },
  feat: { description: "Features", priority: 1 },
  fix: { description: "Bug Fixes", priority: 2 },
};

const validateGitTagExists = (tag) =>
  childProcess
    .execSync(`git rev-list ${tag}`, { stdio: "pipe" })
    .toString("utf-8");

const getGitLogCommand = () => {
  const tag = `v${currentVersion}`;
  const defaultGitLogCommand = `git log --format=%B%H${delimiter}`;

  try {
    validateGitTagExists(tag);
    return `${defaultGitLogCommand} ${tag}..`;
  } catch (e) {
    console.warn(`Unable to find ${tag}. Finding logs from beginning`);
    return defaultGitLogCommand;
  }
};

const getCommits = (appRegExp) =>
  childProcess
    .execSync(`${getGitLogCommand()} -- "${appRegExp}"`)
    .toString("utf-8");

const getAllCommits = () =>
  Object.values(
    ["**/server/**", "**/frontend-app/**", "Dockerfile"]
      .map(getCommits)
      .flatMap((commitString) => commitString.split("----DELIMITER----\n"))
      .filter((commit) => !!commit)
      .map((commit) => {
        const [message, sha] = commit.split("\n");
        const [type] = message.split(":");

        return { sha, message, type };
      })
      .filter(
        ({ type, sha }) =>
          commitTypesToConsider.hasOwnProperty(type) && Boolean(sha)
      )
      .reduce((acc, commit) => {
        return { ...acc, [commit.sha]: commit };
      }, {})
  );

const getCommitsGroupedByType = () =>
  getAllCommits().reduce((acc, commit) => {
    const type = commit.type;
    const previousCommits = acc[type] || [];
    return { ...acc, [type]: [...previousCommits, commit] };
  }, {});

const getCommitTypesInOrder = () =>
  Object.keys(commitTypesToConsider).sort(
    (type1, type2) =>
      commitTypesToConsider[type1].priority -
      commitTypesToConsider[type2].priority
  );

const createLog = (commits, url) =>
  commits
    .map(
      ({ message, sha, type }) =>
        `* ${message.replace(`${type}: `, "")} ([${sha.substring(
          0,
          6
        )}](${url}/commit/${sha}))`
    )
    .join("\n");

const getNewVersion = (changedCommitTypes) => {
  const [major, minor, patch] = currentVersion.split(".").map((x) => Number(x));

  if (changedCommitTypes.indexOf("feat!") !== -1) {
    return `${major + 1}.0.0`;
  }

  if (changedCommitTypes.indexOf("feat") !== -1) {
    return `${major}.${minor + 1}.${patch}`;
  }

  return `${major}.${minor}.${patch + 1}`;
};

const getChangeLogForLatestChanges = (commitsGroupedByType) => {
  const repositoryInfo = packageJson.repository;
  const repositoryUrl = repositoryInfo.url
    .replace(`${repositoryInfo.type}+`, "")
    .replace(`.${repositoryInfo.type}`, "");

  const logs = getCommitTypesInOrder()
    .filter((type) => commitsGroupedByType.hasOwnProperty(type))
    .map((type) => {
      return `### ${commitTypesToConsider[type].description} \n\n${createLog(
        commitsGroupedByType[type],
        repositoryUrl
      )}`;
    });

  return {
    repositoryUrl,
    logs: logs.length === 0 ? ["**Note:** Version bump only"] : logs,
  };
};

const createChangeLogForNewCommits = () => {
  const commitsGroupedByType = getCommitsGroupedByType();
  const newVersion = getNewVersion(Object.keys(commitsGroupedByType));

  const { repositoryUrl, logs } =
    getChangeLogForLatestChanges(commitsGroupedByType);
  const changeLog = logs.join("\n\n");

  const currentDate = new Date().toISOString().split("T")[0];

  return {
    changeLogForNewCommits: `## [${newVersion}](${repositoryUrl}/compare/${currentVersion}...${newVersion}) (${currentDate})\n\n${changeLog}\n\n\n`,
    version: newVersion,
  };
};

const getCurrentChangelog = () => {
  if (!fs.existsSync("./CHANGELOG.md")) return "";
  return fs
    .readFileSync("./CHANGELOG.md", "utf-8")
    .replace(changeLogHeader, "");
};

const main = () => {
  const { changeLogForNewCommits, version } = createChangeLogForNewCommits();
  fs.writeFileSync(
    "./CHANGELOG.md",
    `${changeLogHeader}\n${changeLogForNewCommits}${getCurrentChangelog()}`
  );

  return version;
};

console.log(main());
