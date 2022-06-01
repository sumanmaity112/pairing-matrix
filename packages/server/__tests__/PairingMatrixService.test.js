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

  describe("Generate Pairing Matrix", () => {
    const mockPairingMatrix = {
      matrix: [{ author: "john", coAuthor: "kweller", times: 1 }],
      authors: ["john", "kweller"],
    };

    it.each([
      ["10", "issue", false],
      ["10", "issue", true],
      ["12", "days", true],
      ["13", "days", false],
    ])(
      "should generate pairing matrix with given parameter days='%s' aggregation = '%s' pullData='%s'",
      async (sinceDays, aggregation, pullData) => {
        pairingMatrixGeneratorInstance.generatePairingMatrix.mockResolvedValue(
          mockPairingMatrix
        );

        expect(
          await pairingMatrixService.generatePairingMatrix(
            sinceDays,
            aggregation,
            pullData
          )
        ).toEqual(mockPairingMatrix);

        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledTimes(1);
        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledWith(sinceDays, pullData, aggregation);
      }
    );

    it.each([[""], [undefined]])(
      "should generate pairing matrix with default number of days when days = '%s'",
      async (days) => {
        pairingMatrixGeneratorInstance.generatePairingMatrix.mockResolvedValue(
          mockPairingMatrix
        );

        expect(
          await pairingMatrixService.generatePairingMatrix(days, "issue", false)
        ).toEqual(mockPairingMatrix);

        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledTimes(1);
        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledWith(14, false, "issue");
      }
    );

    it.each([[""], [undefined]])(
      "should generate pairing matrix using default aggregation when aggregation = '%s'",
      async (aggregation) => {
        pairingMatrixGeneratorInstance.generatePairingMatrix.mockResolvedValue(
          mockPairingMatrix
        );

        expect(
          await pairingMatrixService.generatePairingMatrix(
            "10",
            aggregation,
            false
          )
        ).toEqual(mockPairingMatrix);

        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledTimes(1);
        expect(
          pairingMatrixGeneratorInstance.generatePairingMatrix
        ).toBeCalledWith("10", false, "issue");
      }
    );

    it("should throw error for invalid aggregation config", async () => {
      await expect(
        async () =>
          await pairingMatrixService.generatePairingMatrix(
            "10",
            "invaliddd",
            false
          )
      ).rejects.toThrowError("Invalid aggregation config");
    });
  });
});
