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
    const addressRegExp = new RegExp(addressesPrefix, "gi");

    const addressStatement = _.first(
      message
        .replace(
          addressRegExp,
          `${addressesPrefix}${PairingMatrixProcessor.SEPARATOR}`
        )
        .split(addressesPrefix)
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

  static #extractCoAuthor(coAuthorStatement) {
    const parts = coAuthorStatement.split("<");
    const authorName = parts[0].trim();

    if (parts.length === 2)
      return {
        authorName,
        authorEmail: parts[1].replace(">", "").trim().toLocaleLowerCase(),
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

  extractCommitters(commits, referenceExtractor) {
    return commits
      .filter(({ message }) => !_.isEmpty(message))
      .map((commit) => {
        const { authorName, authorEmail, message } = commit;
        return {
          authors: [
            { authorName, authorEmail },
            ...PairingMatrixProcessor.#extractCoAuthors(message),
          ],
          reference: referenceExtractor(commit),
        };
      });
  }

  cardNumberReferenceExtractor(addressPrefix) {
    return ({ message }) =>
      PairingMatrixProcessor.#extractCardNumber(message, addressPrefix);
  }

  daysReferenceExtractor() {
    return ({ timestamp }) => new Date(timestamp).toLocaleDateString();
  }

  extractPairedCommitters(commitsInformation) {
    return commitsInformation.filter(
      ({ authors }) =>
        PairingMatrixProcessor.#getUniqueCommitters(authors).length > 1
    );
  }

  createPairingMatrix(committersWithCardInfo) {
    const dictionary = _.groupBy(committersWithCardInfo, "reference");
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
