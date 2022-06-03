import _ from "lodash";

class PairRecommendationProcessor {
  constructor() {}

  generatePairRecommendation(committersInformation) {
    const authorEmails = PairRecommendationProcessor.#listAllAuthorEmails(
      committersInformation
    );
    const pairingMap = PairRecommendationProcessor.#createPairingMap(
      authorEmails,
      committersInformation
    );

    return PairRecommendationProcessor.#generateRecommendation(
      authorEmails,
      pairingMap
    );
  }

  static #listAllAuthorEmails(committersInformation) {
    return _.uniq(
      _.flatMap(committersInformation, ({ authors }) => authors).map(
        ({ authorEmail }) => authorEmail
      )
    );
  }

  static #createPairingMap(authorEmails, committersInformation) {
    const pairingMap = {};

    for (let index = 0; index < authorEmails.length; index++) {
      const authorEmail = authorEmails[index];
      pairingMap[authorEmail] = PairRecommendationProcessor.#buildPairMap(
        authorEmails,
        authorEmail,
        committersInformation
      );
    }

    return pairingMap;
  }

  static #buildPairMap(authorEmails, authorEmail, committersInformation) {
    const pairMap = {};

    const remainingAuthorEmails = _.without(authorEmails, authorEmail);

    for (const coauthorEmail of remainingAuthorEmails) {
      const latestCommitTime =
        PairRecommendationProcessor.#findLatestCommitTime(
          authorEmail,
          coauthorEmail,
          committersInformation
        );

      pairMap[coauthorEmail] = latestCommitTime || new Date(null);
    }

    return pairMap;
  }

  static #findLatestCommitTime(
    authorEmail,
    coauthorEmail,
    committersInformation
  ) {
    const sortedCommits = _.filter(committersInformation, (committerInfo) => {
      const authors = committerInfo.authors;
      return (
        (authors[0].authorEmail === authorEmail ||
          authors[1].authorEmail === authorEmail) &&
        (authors[0].authorEmail === coauthorEmail ||
          authors[1].authorEmail === coauthorEmail)
      );
    }).sort((commit1, commit2) => {
      return new Date(commit2.pairedOn) - new Date(commit1.pairedOn);
    });

    return _.get(_.first(sortedCommits), "pairedOn");
  }

  static #generateRecommendation(authorEmails, pairingMap) {
    return authorEmails.reduce((acc, authorEmail) => {
      return {
        ...acc,
        [PairRecommendationProcessor.#getEmailPrefix(authorEmail)]:
          PairRecommendationProcessor.#sortCoauthorsByLastPairedOn(
            pairingMap[authorEmail]
          ),
      };
    }, {});
  }

  static #sortCoauthorsByLastPairedOn(coAuthorsInfo) {
    return _.toPairs(coAuthorsInfo)
      .sort(
        (
          [coAuthor1Email, coAuthor1PairedOn],
          [coAuthor2Email, coAuthor2PairedOn]
        ) => {
          return new Date(coAuthor1PairedOn) - new Date(coAuthor2PairedOn);
        }
      )
      .map(([coAuthorEmail]) =>
        PairRecommendationProcessor.#getEmailPrefix(coAuthorEmail)
      );
  }

  static #getEmailPrefix(coAuthorEmail) {
    return _.first(coAuthorEmail.split("@")).toLowerCase();
  }
}

export default PairRecommendationProcessor;
