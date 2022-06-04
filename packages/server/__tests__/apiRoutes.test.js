import request from "supertest";
import express from "express";
import apiRoutes from "../apiRoutes.js";

jest.mock("../PairingMatrixService.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      fetchRepos: mockFetchRepos,
      generatePairingMatrixWithRecommendations: mockGeneratePairingMatrix,
    };
  });
});

const app = express();
app.use("/api", apiRoutes);

describe("Api Routes", () => {
  describe("GET /api/sync", () => {
    it("should return 200 status once all repos got synced", async () => {
      mockFetchRepos.mockResolvedValue({});

      const response = await request(app).get("/api/sync");

      expect(response.statusCode).toBe(200);
      expect(mockFetchRepos).toBeCalledTimes(1);
    });

    it("should return 500 status if unable to sync repos", async () => {
      mockFetchRepos.mockRejectedValueOnce("boom");

      const response = await request(app).get("/api/sync");
      expect(response.statusCode).toBe(500);
      expect(mockFetchRepos).toBeCalledTimes(1);
    });
  });

  describe("GET /api/pair-matrix", () => {
    const mockPairingMatrix = {
      matrix: [{ author: "john", coAuthor: "kweller", times: 1 }],
      authors: ["john", "kweller"],
      recommendations: {
        john: ["kweller"],
        kweller: ["john"],
      },
    };

    it.each([
      ["10", "issue", "false"],
      ["10", "issue", "true"],
      ["12", "days", "true"],
      ["13", "days", "false"],
    ])(
      "should generate pairing matrix with given parameter days='%s' aggregation = '%s' pullData='%s'",
      async (sinceDays, aggregation, pullData) => {
        mockGeneratePairingMatrix.mockResolvedValue(mockPairingMatrix);

        const response = await request(app).get("/api/pair-matrix").query({
          "since-days": sinceDays,
          "pull-data": pullData,
          "aggregate-by": aggregation,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockPairingMatrix);
        expect(mockGeneratePairingMatrix).toBeCalledTimes(1);
        expect(mockGeneratePairingMatrix).toBeCalledWith(
          sinceDays,
          aggregation,
          pullData === "true"
        );
      }
    );

    it("should return 500 status if unable to generate pairing matrix", async () => {
      mockGeneratePairingMatrix.mockRejectedValueOnce("boom");

      const sinceDays = "10";
      const aggregation = "issue";
      const response = await request(app).get("/api/pair-matrix").query({
        "since-days": sinceDays,
        "pull-data": "false",
        "aggregate-by": aggregation,
      });
      expect(response.statusCode).toBe(500);
      expect(mockGeneratePairingMatrix).toBeCalledTimes(1);
      expect(mockGeneratePairingMatrix).toBeCalledWith(
        sinceDays,
        aggregation,
        false
      );
    });
  });
});
