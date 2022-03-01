import PairingMatrixProcessor from "./PairingMatrixProcessor.js";
import GitService from "./GitService.js";
import _ from "lodash";

export default class PairingMatrixGenerator {
    #repos;
    #username;
    #basePath;
    #pairingMatrixProcessor;
    #gitService;

    constructor(username, repos, basePath, sshIdentityFilePath) {
        this.#repos = repos;
        this.#username = username;
        this.#basePath = basePath;
        this.#pairingMatrixProcessor = new PairingMatrixProcessor(username, repos, basePath);
        this.#gitService = new GitService(sshIdentityFilePath)
    }

    async #fetchAllCommits(sinceDays) {
        const promises = _.map(this.#repos, (repoName) => this.#gitService.getCommitsSince(sinceDays, repoName, this.#basePath));

        return _.flatten(await Promise.all(promises))
            .map(({author_name, author_email, message, body}) => ({
                authorName: author_name, authorEmail: author_email, message: `${message}\n${body}`
            }))
    }

    async #getAllCommittersWithCardInfo(sinceDays) {
        const commits = await this.#fetchAllCommits(sinceDays);

        return this.#pairingMatrixProcessor.extractCommitters(commits, "Addresses")
    }

    fetchRepos() {
        return this.#gitService.fetchRepos(this.#repos, this.#username, this.#basePath);
    }

    async generatePairingMatrix(sinceDays, pullData = false) {
        if (pullData) {
            await this.fetchRepos();
        }

        const committersWithCardInfo = await this.#getAllCommittersWithCardInfo(sinceDays);

        const pairedCommitters = this.#pairingMatrixProcessor.extractPairedCommitters(committersWithCardInfo);

        const pairingMatrix = this.#pairingMatrixProcessor.createPairingMatrix(pairedCommitters);

        return {matrix: pairingMatrix, authors: this.#pairingMatrixProcessor.findUniqueAuthors(pairingMatrix)};
    }
}
