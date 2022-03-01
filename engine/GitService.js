import simpleGit from "simple-git";
import {existsSync} from "fs";
import _ from "lodash";

export default class GitService {

    static ONE_DAY = 86400000;

    #sshIdentityFilePath;

    constructor(sshIdentityFilePath) {
        this.#sshIdentityFilePath = sshIdentityFilePath;

    }

    static #getDate(sinceDays) {
        return new Date(new Date() - (sinceDays * GitService.ONE_DAY))
    }

    static async #getCommits(localPath, from) {
        return (await simpleGit(localPath).log([`--since=${from}`])).all;
    }

    static #fetch(repoName, username, localPath, overrideableEnvVariables) {
        const envVariables = {...process.env, ...overrideableEnvVariables};

        if (existsSync(localPath)) {
            console.log(`Pulling latest changes for ${repoName}`)
            return simpleGit(localPath)
                .env(envVariables)
                .pull()
                .catch(e => console.error(e));
        }

        console.log(`Cloning ${repoName} repo to ${localPath}`);

        return simpleGit()
            .env(envVariables)
            .clone(`git@github.com:${username}/${repoName}.git`, localPath)
            .catch(e => console.error(e));
    }

    #overrideableEnvVariables() {
        if (_.isEmpty(this.#sshIdentityFilePath)) {
            return {};
        }
        return {
            GIT_SSH_COMMAND: `ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i ${this.#sshIdentityFilePath}`
        };
    }

    fetchRepos(repos, username, localPath) {
        const overrideableEnvVariables = this.#overrideableEnvVariables();

        return Promise.allSettled(repos.map(repoName => GitService.#fetch(repoName, username, `${localPath}/${repoName}`, overrideableEnvVariables)));
    }

    getCommitsSince(sinceDays, repoName, localPath) {
        return GitService.#getCommits(`${localPath}/${repoName}`, GitService.#getDate(sinceDays));
    }
}
