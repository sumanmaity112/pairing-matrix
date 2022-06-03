import simpleGit from "simple-git";
import fs from "fs";

jest.mock("simple-git");
jest.mock("fs");

import GitService from "../GitService.js";

describe("GitService", () => {
  const localPath = "/tmp";
  const username = "testuser";
  const sshIdentityFilePath = "/abc/xyz/id_rsa";

  describe.each([
    ["exists", true],
    ["does not exists", false],
  ])("override git ssh command when file locally %s", (testPrefix, exists) => {
    const mockEnvMethod = jest.fn();
    const mockClone = jest.fn();
    const mockPull = jest.fn();

    beforeEach(() => {
      fs.existsSync.mockReturnValue(exists);

      simpleGit.mockReturnValue({ env: mockEnvMethod });
      mockClone.mockResolvedValue({});
      mockPull.mockResolvedValue({});
      mockEnvMethod.mockReturnValue({ clone: mockClone, pull: mockPull });
    });

    const repoNames = ["repo1"];
    it("should add git ssh command when identity file path is provided", async () => {
      const gitService = new GitService(sshIdentityFilePath);
      await gitService.fetchRepos(repoNames, username, localPath);

      expect(mockEnvMethod).toBeCalledTimes(repoNames.length);
      expect(mockEnvMethod).toBeCalledWith({
        ...process.env,
        GIT_SSH_COMMAND: `ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i ${sshIdentityFilePath}`,
      });
    });

    it.each([[undefined], [""]])(
      "should not add git ssh command when identity file path is '%s'",
      async (identityPath) => {
        const gitService = new GitService(identityPath);
        await gitService.fetchRepos(repoNames, username, localPath);

        expect(mockEnvMethod).toBeCalledTimes(repoNames.length);
        expect(mockEnvMethod).toBeCalledWith(process.env);
      }
    );
  });

  describe("Fetch Repositories", () => {
    describe("Clone New Repository", () => {
      const mockEnvMethod = jest.fn();
      const mockClone = jest.fn();

      let gitService;

      const repoNames = ["repo1", "repo2"];
      beforeEach(() => {
        fs.existsSync.mockReturnValue(false);

        simpleGit.mockReturnValue({ env: mockEnvMethod });
        mockClone.mockResolvedValue({});
        mockEnvMethod.mockReturnValue({ clone: mockClone });
        gitService = new GitService();
      });

      it("should clone repository if it is not already present", async () => {
        await gitService.fetchRepos(repoNames, username, localPath);

        expect(fs.existsSync).toBeCalledTimes(2);
        expect(fs.existsSync).toHaveBeenNthCalledWith(1, `${localPath}/repo1`);
        expect(fs.existsSync).toHaveBeenNthCalledWith(2, `${localPath}/repo2`);

        expect(mockEnvMethod).toBeCalledTimes(2);
        expect(mockEnvMethod).toBeCalledWith(process.env);
        expect(mockClone).toHaveBeenNthCalledWith(
          1,
          `git@github.com:${username}/repo1.git`,
          `${localPath}/repo1`
        );
        expect(mockClone).toHaveBeenNthCalledWith(
          2,
          `git@github.com:${username}/repo2.git`,
          `${localPath}/repo2`
        );
      });

      it("should not throw exception if unable to clone repository", async () => {
        mockClone.mockRejectedValue({ message: "boom" });

        await gitService.fetchRepos(repoNames, username, localPath);

        expect(fs.existsSync).toBeCalledTimes(2);
        expect(mockEnvMethod).toBeCalledTimes(2);
      });
    });

    describe("Pull Latest Changes", () => {
      const mockEnvMethod = jest.fn();
      const mockPull = jest.fn();
      const repoNames = ["repo1", "repo2"];

      let gitService;
      beforeEach(() => {
        fs.existsSync.mockReturnValue(true);

        simpleGit.mockReturnValue({ env: mockEnvMethod });
        mockPull.mockResolvedValue({});
        mockEnvMethod.mockReturnValue({ pull: mockPull });
        gitService = new GitService();
      });

      it("should pull latest changes from repository", async () => {
        await gitService.fetchRepos(repoNames, username, localPath);

        expect(fs.existsSync).toBeCalledTimes(2);
        expect(fs.existsSync).toHaveBeenNthCalledWith(1, `${localPath}/repo1`);
        expect(fs.existsSync).toHaveBeenNthCalledWith(2, `${localPath}/repo2`);

        expect(mockEnvMethod).toBeCalledTimes(2);
        expect(mockPull).toBeCalledTimes(2);
      });

      it("should not throw exception if unable to pull repository", async () => {
        mockPull.mockRejectedValue({ message: "boom" });

        await gitService.fetchRepos(repoNames, username, localPath);

        expect(fs.existsSync).toBeCalledTimes(2);
        expect(mockEnvMethod).toBeCalledTimes(2);
      });
    });
  });

  describe("Get Commits", () => {
    const baseCommit = {
      timestamp: "2022-05-19T11:16:54+05:30",
      authorName: "John Doe",
      authorEmail: "john@test.com",
      message: `Introduce test \n Addresses BAH-1571 \n Co-authored-by: Kurt Weller <kweller@test.com>`,
    };

    it.each([
      ["repo1", 12],
      ["repo1", 10],
      ["repo2", 14],
    ])(
      "should list commits for %s repo and last %d days",
      async (repoName, sinceDays) => {
        const mockLog = jest.fn();
        const commitInfo = {
          all: [
            { ...baseCommit },
            { ...baseCommit },
            {
              ...baseCommit,
              message: `Introduce test \n Addresses BAH-1571 \n Co-authored-by: John Weller <jweller@test.com>`,
            },
            {
              ...baseCommit,
              timestamp: "2022-04-17T10:16:54+05:30",
              authorName: "Tony Stark",
              authorEmail: "tony@test.com",
              message: `Introduce test \n Addresses BAH-1561 \n Co-authored-by: John Weller <jweller@test.com>`,
            },
            {
              ...baseCommit,
              timestamp: "2022-04-18T10:19:54+05:30",
              authorName: "Tony Stark",
              authorEmail: "tony@test.com",
              message: `Introduce test \n Addresses BAH-1561 \n Co-authored-by: John Weller <jweller@test.com>`,
            },
          ],
        };
        mockLog.mockReturnValueOnce(commitInfo);
        simpleGit.mockReturnValue({ log: mockLog });
        const gitService = new GitService();

        const commits = await gitService.getCommitsSince(
          sinceDays,
          repoName,
          localPath
        );

        expect(simpleGit).toBeCalledTimes(1);
        expect(simpleGit).toBeCalledWith(`${localPath}/${repoName}`);
        expect(mockLog).toBeCalledTimes(1);
        expect(mockLog).toBeCalledWith([
          `--since=${new Date(new Date() - sinceDays * 86400000)} --all`,
        ]);

        expect(commits).toEqual(commitInfo.all);
      }
    );
  });
});
