import PairingMatrixProcessor from "./PairingMatrixProcessor.js";
import GitService from "./GitService.js";
import _ from "lodash";

export default class PairingMatrixGenerator {
  static AGGREGATE_BY_ISSUE = "issue";
  static AGGREGATE_BY_DATE = "date";

  #repos;
  #username;
  #basePath;
  #pairingMatrixProcessor;
  #gitService;

  constructor(username, repos, basePath, sshIdentityFilePath) {
    this.#repos = repos;
    this.#username = username;
    this.#basePath = basePath;
    this.#pairingMatrixProcessor = new PairingMatrixProcessor(
      username,
      repos,
      basePath
    );
    this.#gitService = new GitService(sshIdentityFilePath);
  }

  async #fetchAllCommits(sinceDays) {
    const promises = _.map(this.#repos, (repoName) =>
      this.#gitService.getCommitsSince(sinceDays, repoName, this.#basePath)
    );

    return _.flatten(await Promise.all(promises)).map(
      ({ author_name, author_email, message, body, date }) => ({
        timestamp: date,
        authorName: author_name,
        authorEmail: author_email,
        message: `${message}\n${body}`,
      })
    );
  }

  async #getAllCommitters(sinceDays, referenceExtractor) {
    const commits = await this.#fetchAllCommits(sinceDays);

    return this.#pairingMatrixProcessor.extractCommitters(
      commits,
      referenceExtractor
    );
  }

  fetchRepos() {
    return this.#gitService.fetchRepos(
      this.#repos,
      this.#username,
      this.#basePath
    );
  }

  async generatePairingMatrix(
    sinceDays,
    pullData = false,
    aggregateBy = PairingMatrixGenerator.AGGREGATE_BY_ISSUE,
    cardNumberPrefix = "Addresses"
  ) {
    if (pullData) {
      await this.fetchRepos();
    }

    const referenceExtractor = this.#getReferenceExtractor(
      aggregateBy,
      cardNumberPrefix
    );
    const committersWithCardInfo = await this.#getAllCommitters(
      sinceDays,
      referenceExtractor
    );

    const pairedCommitters =
      this.#pairingMatrixProcessor.extractPairedCommitters(
        committersWithCardInfo
      );

    const pairingMatrix =
      this.#pairingMatrixProcessor.createPairingMatrix(pairedCommitters);

    return {
      matrix: pairingMatrix,
      authors: this.#pairingMatrixProcessor.findUniqueAuthors(pairingMatrix),
    };
  }

  #getReferenceExtractor(aggregateBy, cardNumberPrefix) {
    switch (aggregateBy) {
      case PairingMatrixGenerator.AGGREGATE_BY_ISSUE:
        return this.#pairingMatrixProcessor.cardNumberReferenceExtractor(
          cardNumberPrefix
        );
      case PairingMatrixGenerator.AGGREGATE_BY_DATE:
        return this.#pairingMatrixProcessor.dateReferenceExtractor();
      default:
        throw new Error(`Invalid aggregation config ${aggregateBy}`);
    }
  }
}
