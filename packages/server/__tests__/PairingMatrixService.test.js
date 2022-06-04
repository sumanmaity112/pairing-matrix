import PairingMatrixService from "../PairingMatrixService.js";
import PairingMatrixGenerator from "pairing-matrix-engine";
import { getPairingMatrixConfig } from "../utils.js";

jest.mock("pairing-matrix-engine");
jest.mock("../utils.js");

describe("PairingMatrixService", () => {
  const pairingMatrixConfig = {
    repos: ["repo1", "repo2"],
    username: "test-user",
    basePath: "/temp",
    sshIdentityFilePath: "id_rsa",
  };

  let pairingMatrixService;
  let pairingMatrixGeneratorInstance;

  beforeEach(() => {
    getPairingMatrixConfig.mockReturnValue(pairingMatrixConfig);

    pairingMatrixService = new PairingMatrixService();
    pairingMatrixGeneratorInstance = PairingMatrixGenerator.mock.instances[0];
  });

  it("should fetch repos", async () => {
    pairingMatrixGeneratorInstance.fetchRepos.mockResolvedValue({});

    await pairingMatrixService.fetchRepos();

    expect(pairingMatrixGeneratorInstance.fetchRepos).toBeCalledTimes(1);
  });

  describe("Generate Pairing Matrix With Recommendations", () => {
    const mockPairingMatrix = {
      matrix: [{ author: "john", coAuthor: "kweller", times: 1 }],
      authors: ["john", "kweller"],
    };

    const mockRecommendations = {
      john: ["kweller"],
      kweller: ["john"],
    };

    const mockPairingMatrixWithRecommendations = {
      ...mockPairingMatrix,
      recommendations: mockRecommendations,
    };

    beforeEach(() => {
      pairingMatrixGeneratorInstance.generatePairingMatrix.mockResolvedValue(
        mockPairingMatrix
      );

      pairingMatrixGeneratorInstance.generatePairRecommendation.mockResolvedValue(
        mockRecommendations
      );
    });

    it.each([
      ["10", "issue", false],
      ["10", "issue", true],
      ["12", "days", true],
      ["13", "days", false],
    ])(
      "should generate pairing matrix with given parameter days='%s' aggregation = '%s' pullData='%s'",
      async (sinceDays, aggregation, pullData) => {
        expect(
          await pairingMatrixService.generatePairingMatrixWithRecommendations(
            sinceDays,
            aggregation,
            pullData
          )
        ).toEqual(mockPairingMatrixWithRecommendations);

        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledTimes(1);

        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledWith(sinceDays, pullData, aggregation);

        expect(
          pairingMatrixGeneratorInstance.generatePairRecommendation
        ).toBeCalledTimes(1);

        expect(
          pairingMatrixGeneratorInstance.generatePairRecommendation
        ).toBeCalledWith(sinceDays, false);
      }
    );

    it.each([[""], [undefined]])(
      "should generate pairing matrix with default number of days when days = '%s'",
      async (days) => {
        expect(
          await pairingMatrixService.generatePairingMatrixWithRecommendations(
            days,
            "issue",
            false
          )
        ).toEqual(mockPairingMatrixWithRecommendations);

        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledTimes(1);
        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledWith(14, false, "issue");

        expect(
          pairingMatrixGeneratorInstance.generatePairRecommendation
        ).toBeCalledTimes(1);

        expect(
          pairingMatrixGeneratorInstance.generatePairRecommendation
        ).toBeCalledWith(14, false);
      }
    );

    it.each([[""], [undefined]])(
      "should generate pairing matrix using default aggregation when aggregation = '%s'",
      async (aggregation) => {
        expect(
          await pairingMatrixService.generatePairingMatrixWithRecommendations(
            "10",
            aggregation,
            false
          )
        ).toEqual(mockPairingMatrixWithRecommendations);

        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledTimes(1);
        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledWith("10", false, "issue");

        expect(
          pairingMatrixGeneratorInstance.generatePairRecommendation
        ).toBeCalledTimes(1);

        expect(
          pairingMatrixGeneratorInstance.generatePairRecommendation
        ).toBeCalledWith("10", false);
      }
    );

    it("should throw error for invalid aggregation config", async () => {
      await expect(
        async () =>
          await pairingMatrixService.generatePairingMatrixWithRecommendations(
            "10",
            "invaliddd",
            false
          )
      ).rejects.toThrowError("Invalid aggregation config");

      expect(
        pairingMatrixGeneratorInstance.generatePairingMatrix
      ).not.toBeCalled();
      expect(
        pairingMatrixGeneratorInstance.generatePairRecommendation
      ).not.toBeCalled();
    });
  });
});
