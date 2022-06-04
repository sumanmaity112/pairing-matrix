import { getPairingMatrixConfig } from "./utils.js";
import PairingMatrixGenerator from "pairing-matrix-engine";
import _ from "lodash";

class PairingMatrixService {
  #pairingMatrixGenerator = null;

  constructor() {
    const { basePath, repos, sshIdentityFilePath, username } =
      getPairingMatrixConfig();
    this.#pairingMatrixGenerator = new PairingMatrixGenerator(
      username,
      repos,
      basePath,
      sshIdentityFilePath
    );
  }

  fetchRepos() {
    return this.#pairingMatrixGenerator.fetchRepos();
  }

  static #getAggregation(aggregateBy) {
    if (
      _.isEmpty(aggregateBy) ||
      aggregateBy === PairingMatrixGenerator.AGGREGATE_BY_ISSUE
    )
      return PairingMatrixGenerator.AGGREGATE_BY_ISSUE;
    else if (aggregateBy === PairingMatrixGenerator.AGGREGATE_BY_DAYS)
      return PairingMatrixGenerator.AGGREGATE_BY_DAYS;
    return null;
  }

  async generatePairingMatrixWithRecommendations(
    sinceDays,
    aggregateBy,
    pullData
  ) {
    const aggregation = PairingMatrixService.#getAggregation(aggregateBy);
    if (!aggregation) {
      throw new Error("Invalid aggregation config");
    }
    const days = PairingMatrixService.#getSinceDays(sinceDays);
    const pairingMatrix =
      await this.#pairingMatrixGenerator.generatePairingMatrix(
        days,
        pullData,
        aggregation
      );

    const recommendations =
      await this.#pairingMatrixGenerator.generatePairRecommendation(
        days,
        false
      );

    return { ...pairingMatrix, recommendations };
  }

  static #getSinceDays(sinceDays) {
    return _.isEmpty(sinceDays) ? 14 : sinceDays;
  }
}

export default PairingMatrixService;
