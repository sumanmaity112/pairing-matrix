import PairingMatrixProcessor from "./PairingMatrixProcessor.js";
import GitService from "./GitService.js";
import _ from "lodash";
import PairRecommendationProcessor from "./PairRecommendationProcessor.js";

export default class PairingMatrixGenerator {
  static AGGREGATE_BY_ISSUE = "issue";
  static AGGREGATE_BY_DAYS = "days";

  #repos;
  #username;
  #basePath;
  #pairingMatrixProcessor;
  #gitService;
  #pairRecommendationProcessor;

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
    this.#pairRecommendationProcessor = new PairRecommendationProcessor();
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
    aggregateBy = PairingMatrixGenerator.AGGREGATE_BY_DAYS,
    cardNumberPrefix = "Addresses"
  ) {
    if (pullData) {
      await this.fetchRepos();
    }

    const referenceExtractor = this.#getReferenceExtractor(
      aggregateBy,
      cardNumberPrefix
    );

    const committersWithReference = await this.#getAllCommitters(
      sinceDays,
      referenceExtractor
    );

    const pairedCommitters =
      this.#pairingMatrixProcessor.extractPairedCommitters(
        committersWithReference
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
      case PairingMatrixGenerator.AGGREGATE_BY_DAYS:
        return this.#pairingMatrixProcessor.daysReferenceExtractor();
      default:
        throw new Error(`Invalid aggregation config ${aggregateBy}`);
    }
  }

  async generatePairRecommendation(sinceDays = 14, pullData = false) {
    if (pullData) {
      await this.fetchRepos();
    }

    const commits = await this.#fetchAllCommits(sinceDays);

    const committersWithReference =
      this.#pairingMatrixProcessor.extractCommittersWithTimestamp(commits);

    const pairedCommitters =
      this.#pairingMatrixProcessor.extractPairedCommitters(
        committersWithReference
      );

    return this.#pairRecommendationProcessor.generatePairRecommendation(
      pairedCommitters
    );
  }
}
