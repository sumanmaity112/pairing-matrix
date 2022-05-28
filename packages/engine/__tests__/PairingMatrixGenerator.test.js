import GitService from "../GitService.js";
import PairingMatrixProcessor from "../PairingMatrixProcessor.js";

jest.mock("../GitService.js");
jest.mock("../PairingMatrixProcessor.js");

import PairingMatrixGenerator from "../PairingMatrixGenerator.js";

describe("Pairing Matrix Generator", () => {
  const localPath = "/tmp";
  const username = "testuser";
  const sshIdentityFilePath = "/abc/xyz/id_rsa";
  const repoNames = ["repo1", "repo2"];

  let pairingMatrixGenerator;
  let gitServiceInstance;
  let pairingMatrixProcessorInstance;
  
  beforeEach(() => {
    pairingMatrixGenerator = new PairingMatrixGenerator(
      username,
      repoNames,
      localPath,
      sshIdentityFilePath
    );
    gitServiceInstance = GitService.mock.instances[0];
    pairingMatrixProcessorInstance = PairingMatrixProcessor.mock.instances[0];

    expect(GitService).toBeCalledTimes(1);
    expect(GitService).toBeCalledWith(sshIdentityFilePath);
    expect(PairingMatrixProcessor).toBeCalledTimes(1);
    expect(PairingMatrixProcessor).toBeCalledWith(
      username,
      repoNames,
      localPath
    );
  });

  it("should fetch repos", () => {
    pairingMatrixGenerator.fetchRepos();

    expect(gitServiceInstance.fetchRepos).toBeCalledTimes(1);
    expect(gitServiceInstance.fetchRepos).toBeCalledWith(
      repoNames,
      username,
      localPath
    );
  });

  it("should throw error for invalid aggregation config while generating pairing matrix", async () => {
    const aggregateBy = "hours";
    await expect(
      async () =>
        await pairingMatrixGenerator.generatePairingMatrix(
          12,
          false,
          aggregateBy
        )
    ).rejects.toThrowError(`Invalid aggregation config ${aggregateBy}`);
  });

  describe("Generate Pairing Matrix", () => {
    const baseCommit = {
      date: "2022-05-19T11:16:54+05:30",
      author_name: "John Doe",
      author_email: "john@test.com",
      message: `Introduce test`,
      body: `Addresses BAH-1571 \n Co-authored-by: Kurt Weller <kweller@test.com>`,
    };

    const commits1 = [
      { ...baseCommit },
      { ...baseCommit },
      {
        ...baseCommit,
        message: `Introduce test`,
        body: `Addresses BAH-1571 \n Co-authored-by: John Weller <jweller@test.com>`,
      },
    ];

    const commits2 = [
      {
        ...baseCommit,
        date: "2022-04-17T10:16:54+05:30",
        author_name: "Tony Stark",
        author_email: "tony@test.com",
        message: `Introduce test`,
        body: `Addresses BAH-1561 \n Co-authored-by: John Weller <jweller@test.com>`,
      },
      {
        ...baseCommit,
        date: "2022-04-18T10:19:54+05:30",
        author_name: "Tony Stark",
        author_email: "tony@test.com",
        message: `Introduce test`,
        body: `Addresses BAH-1561 \n Co-authored-by: John Weller <jweller@test.com>`,
      },
    ];

    const processedCommits = [...commits1, ...commits2].map(
      ({ author_name, author_email, message, body, date }) => ({
        timestamp: date,
        authorName: author_name,
        authorEmail: author_email,
        message: `${message}\n${body}`,
      })
    );

    const groupedCommuters = [
      {
        authors: [
          { authorName: "John Doe", authorEmail: "john@test.com" },
          { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
        ],
        reference: "5/19/2022",
      },
      {
        authors: [
          { authorName: "John Doe", authorEmail: "john@test.com" },
          { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
          { authorName: "Tony Stark", authorEmail: "tony@test.com" },
        ],
        reference: "5/19/2022",
      },
      {
        authors: [
          { authorName: "John Doe", authorEmail: "john@test.com" },
          { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
        ],
        reference: "5/19/2022",
      },
      {
        authors: [
          { authorName: "John Doe", authorEmail: "john@test.com" },
          { authorName: "John Weller", authorEmail: "jweller@test.com" },
        ],
        reference: "5/19/2022",
      },
      {
        authors: [
          { authorName: "Tony Stark", authorEmail: "tony@test.com" },
          { authorName: "John Weller", authorEmail: "jweller@test.com" },
        ],
        reference: "4/17/2022",
      },
      {
        authors: [
          { authorName: "Tony Stark", authorEmail: "tony@test.com" },
          { authorName: "John Weller", authorEmail: "jweller@test.com" },
        ],
        reference: "4/18/2022",
      },
    ];

    const mockPairingMatrix = [
      { author: "john", coAuthor: "kweller", times: 1 },
      {
        author: "kweller",
        coAuthor: "tony",
        times: 1,
      },
      { author: "john", coAuthor: "srogers", times: 1 },
      {
        author: "tony",
        coAuthor: "srogers",
        times: 2,
      },
    ];

    const uniqueAuthors = ["john", "kweller", "srogers", "tony"];

    beforeEach(() => {
      gitServiceInstance.getCommitsSince
        .mockResolvedValueOnce(commits1)
        .mockResolvedValueOnce(commits2);
      pairingMatrixProcessorInstance.extractCommitters.mockResolvedValueOnce(
        groupedCommuters
      );
      pairingMatrixProcessorInstance.extractPairedCommitters.mockReturnValueOnce(
        groupedCommuters
      );
      pairingMatrixProcessorInstance.createPairingMatrix.mockReturnValueOnce(
        mockPairingMatrix
      );
      pairingMatrixProcessorInstance.findUniqueAuthors.mockReturnValue(
        uniqueAuthors
      );
    });

    afterEach(() => {
      expect(
        pairingMatrixProcessorInstance.extractPairedCommitters
      ).toBeCalledTimes(1);
      expect(
        pairingMatrixProcessorInstance.extractPairedCommitters
      ).toBeCalledWith(groupedCommuters);
      expect(pairingMatrixProcessorInstance.createPairingMatrix).toBeCalledWith(
        groupedCommuters
      );
      expect(pairingMatrixProcessorInstance.findUniqueAuthors).toBeCalledWith(
        mockPairingMatrix
      );
    });

    it("should create pairing matrix using default parameter values", async () => {
      const expectedProcessedCommits = [...commits1, ...commits2].map(
        ({ author_name, author_email, message, body, date }) => ({
          timestamp: date,
          authorName: author_name,
          authorEmail: author_email,
          message: `${message}\n${body}`,
        })
      );

      const sinceDays = 12;

      const mockDaysReferenceExtractor = jest.fn();
      pairingMatrixProcessorInstance.daysReferenceExtractor.mockReturnValue(
        mockDaysReferenceExtractor
      );

      const pairingMatrix = await pairingMatrixGenerator.generatePairingMatrix(
        sinceDays
      );

      expect(gitServiceInstance.fetchRepos).not.toHaveBeenCalled();
      expect(gitServiceInstance.getCommitsSince).toBeCalledTimes(2);
      expect(gitServiceInstance.getCommitsSince).toHaveBeenNthCalledWith(
        1,
        sinceDays,
        repoNames[0],
        localPath
      );
      expect(gitServiceInstance.getCommitsSince).toHaveBeenNthCalledWith(
        2,
        sinceDays,
        repoNames[1],
        localPath
      );
      expect(pairingMatrixProcessorInstance.extractCommitters).toBeCalledTimes(
        1
      );
      expect(
        pairingMatrixProcessorInstance.extractCommitters
      ).toHaveBeenCalledWith(
        expectedProcessedCommits,
        mockDaysReferenceExtractor
      );
      expect(
        pairingMatrixProcessorInstance.daysReferenceExtractor
      ).toBeCalledTimes(1);

      expect(pairingMatrix).toEqual({
        matrix: mockPairingMatrix,
        authors: uniqueAuthors,
      });
    });

    it("should create pairing matrix using issue aggregation", async () => {
      const sinceDays = 12;

      const mockCardNumberReferenceExtractor = jest.fn();
      pairingMatrixProcessorInstance.cardNumberReferenceExtractor.mockReturnValue(
        mockCardNumberReferenceExtractor
      );

      const pairingMatrix = await pairingMatrixGenerator.generatePairingMatrix(
        sinceDays,
        false,
        PairingMatrixGenerator.AGGREGATE_BY_ISSUE,
        "BAH"
      );

      expect(gitServiceInstance.fetchRepos).not.toHaveBeenCalled();
      expect(gitServiceInstance.getCommitsSince).toBeCalledTimes(2);
      expect(gitServiceInstance.getCommitsSince).toHaveBeenNthCalledWith(
        1,
        sinceDays,
        repoNames[0],
        localPath
      );
      expect(gitServiceInstance.getCommitsSince).toHaveBeenNthCalledWith(
        2,
        sinceDays,
        repoNames[1],
        localPath
      );
      expect(pairingMatrixProcessorInstance.extractCommitters).toBeCalledTimes(
        1
      );
      expect(
        pairingMatrixProcessorInstance.extractCommitters
      ).toHaveBeenCalledWith(
        processedCommits,
        mockCardNumberReferenceExtractor
      );
      expect(
        pairingMatrixProcessorInstance.cardNumberReferenceExtractor
      ).toBeCalledTimes(1);
      expect(
        pairingMatrixProcessorInstance.cardNumberReferenceExtractor
      ).toBeCalledWith("BAH");
      expect(pairingMatrix).toEqual({
        matrix: mockPairingMatrix,
        authors: uniqueAuthors,
      });
    });

    it("should pull latest changes while creating pairing matrix", async () => {
      const sinceDays = 12;

      const mockDaysReferenceExtractor = jest.fn();
      pairingMatrixProcessorInstance.daysReferenceExtractor.mockReturnValue(
        mockDaysReferenceExtractor
      );

      const pairingMatrix = await pairingMatrixGenerator.generatePairingMatrix(
        sinceDays,
        true
      );

      expect(gitServiceInstance.fetchRepos).toHaveBeenCalledTimes(1);
      expect(gitServiceInstance.fetchRepos).toHaveBeenCalledWith(
        repoNames,
        username,
        localPath
      );
      expect(gitServiceInstance.getCommitsSince).toBeCalledTimes(
        repoNames.length
      );
      expect(gitServiceInstance.getCommitsSince).toHaveBeenNthCalledWith(
        1,
        sinceDays,
        repoNames[0],
        localPath
      );
      expect(gitServiceInstance.getCommitsSince).toHaveBeenNthCalledWith(
        2,
        sinceDays,
        repoNames[1],
        localPath
      );
      expect(pairingMatrixProcessorInstance.extractCommitters).toBeCalledTimes(
        1
      );
      expect(
        pairingMatrixProcessorInstance.extractCommitters
      ).toHaveBeenCalledWith(processedCommits, mockDaysReferenceExtractor);
      expect(
        pairingMatrixProcessorInstance.daysReferenceExtractor
      ).toBeCalledTimes(1);
      expect(pairingMatrix).toEqual({
        matrix: mockPairingMatrix,
        authors: uniqueAuthors,
      });
    });
  });
});
