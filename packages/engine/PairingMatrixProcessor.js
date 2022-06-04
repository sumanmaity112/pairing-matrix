import _ from "lodash";

export default class PairingMatrixProcessor {
  static SEPARATOR = "----------- SEPARATOR -----------";
  static CO_AUTHOR_REPLACER = `CO-AUTHORED-BY:`;

  #username;
  #repos;
  #basePath;

  constructor(username, repos, basePath) {
    this.#username = username;
    this.#repos = repos;
    this.#basePath = basePath;
  }

  static #extractCoAuthors(message) {
    return message
      .replace(
        new RegExp(PairingMatrixProcessor.CO_AUTHOR_REPLACER, "gi"),
        `${PairingMatrixProcessor.CO_AUTHOR_REPLACER}${PairingMatrixProcessor.SEPARATOR}`
      )
      .split(PairingMatrixProcessor.CO_AUTHOR_REPLACER)
      .filter((element) => element.includes(PairingMatrixProcessor.SEPARATOR))
      .map((element) =>
        element.replace(PairingMatrixProcessor.SEPARATOR, "").trim()
      )
      .map(PairingMatrixProcessor.#extractCoAuthor);
  }

  static #extractCardNumber(message, addressesPrefix) {
    const normalisePrefix =
      PairingMatrixProcessor.#normalisePrefix(addressesPrefix);
    const addressRegExp = new RegExp(normalisePrefix, "gi");

    const addressStatement = _.first(
      message
        .replace(
          addressRegExp,
          `${normalisePrefix}${PairingMatrixProcessor.SEPARATOR}`
        )
        .split(normalisePrefix)
        .filter((text) => text.includes(PairingMatrixProcessor.SEPARATOR))
    );

    return addressStatement
      ? addressStatement
          .replace(PairingMatrixProcessor.SEPARATOR, "")
          .trim()
          .split(/\s+/)[0]
          .toUpperCase()
      : addressStatement;
  }

  static #normalisePrefix(addressesPrefix) {
    return addressesPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  static #extractCoAuthor(coAuthorStatement) {
    const parts = coAuthorStatement.split("<");
    const authorName = parts[0].trim();

    if (parts.length === 2)
      return {
        authorName,
        authorEmail: parts[1].replace(">", "").trim().toLowerCase(),
      };
    return { authorName };
  }

  static #findUniquePairs(value) {
    return _.uniqWith(_.map(value, "authors"), _.isEqual);
  }

  static #createPairId(pair) {
    return _.join(_.map(_.sortBy(pair, "authorEmail"), "authorEmail"), "____");
  }

  static #getUniqueCommitters(authors) {
    return _.uniqBy(
      _.filter(authors, ({ authorEmail }) => !_.isEmpty(authorEmail)),
      "authorEmail"
    );
  }

  static #extractCommitters(commits, referenceGenerator) {
    return commits
      .filter(({ message }) => !_.isEmpty(message))
      .map((commit) => {
        const { authorName, authorEmail, message } = commit;
        return {
          authors: [
            { authorName, authorEmail: authorEmail.toLowerCase() },
            ...PairingMatrixProcessor.#extractCoAuthors(message),
          ],
          ...referenceGenerator(commit),
        };
      });
  }

  extractCommitters(commits, referenceExtractor) {
    return PairingMatrixProcessor.#extractCommitters(commits, (commit) => ({
      reference: referenceExtractor(commit),
    }));
  }

  extractCommittersWithTimestamp(commits) {
    return PairingMatrixProcessor.#extractCommitters(
      commits,
      ({ timestamp }) => ({
        pairedOn: timestamp,
      })
    );
  }

  cardNumberReferenceExtractor(addressPrefix) {
    return ({ message }) =>
      PairingMatrixProcessor.#extractCardNumber(message, addressPrefix);
  }

  daysReferenceExtractor() {
    return ({ timestamp }) => new Date(timestamp).toISOString().split("T")[0];
  }

  extractPairedCommitters(commitsInformation) {
    const commitsWithMultipleAuthors = commitsInformation.filter(
      ({ authors }) =>
        PairingMatrixProcessor.#getUniqueCommitters(authors).length > 1
    );

    return _.flatMap(
      commitsWithMultipleAuthors,
      PairingMatrixProcessor.#createPairCommitters
    );
  }

  static #createPairCommitters(commit) {
    const { authors } = commit;

    const pairedAuthors = [];

    for (let i = 0; i < authors.length - 1; i++) {
      for (let j = i + 1; j < authors.length; j++) {
        pairedAuthors.push({ ...commit, authors: [authors[i], authors[j]] });
      }
    }

    return pairedAuthors;
  }

  createPairingMatrix(committersWithReference) {
    const dictionary = _.groupBy(committersWithReference, "reference");
    const pairs = _.flatten(
      _.map(dictionary, PairingMatrixProcessor.#findUniquePairs)
    );

    return _.map(
      _.groupBy(pairs, PairingMatrixProcessor.#createPairId),
      (x) => {
        const propertyName = "authorEmail";
        const pair = x[0];

        return {
          author: pair[0][propertyName].split("@")[0].toLocaleLowerCase(),
          coAuthor: pair[1][propertyName].split("@")[0].toLocaleLowerCase(),
          times: x.length,
        };
      }
    );
  }

  findUniqueAuthors(pairMatrix) {
    return _.uniq(
      _.flatMap(pairMatrix, ({ author, coAuthor }) => [author, coAuthor])
    );
  }
}
