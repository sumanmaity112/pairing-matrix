import PairRecommendationProcessor from "../PairRecommendationProcessor.js";

describe("Pair Recommendation Processor", () => {
  let pairRecommendationProcessor;

  beforeEach(() => {
    pairRecommendationProcessor = new PairRecommendationProcessor();
  });

  describe("Generate Pair Recommendation", () => {
    const authorJohnD = {
      authorName: "John Doe",
      authorEmail: "john@test.com",
    };

    const authorKurt = {
      authorName: "Kurt Weller",
      authorEmail: "kweller@test.com",
    };

    const authorTony = {
      authorName: "Tony Stark",
      authorEmail: "tony@test.com",
    };

    const authorJohnW = {
      authorName: "John Weller",
      authorEmail: "jweller@test.com",
    };

    it("should generate pair recommendation 1", () => {
      const committers = [
        {
          authors: [authorJohnD, authorKurt],
          pairedOn: "2022-05-19T11:16:54+05:30",
        },
        {
          authors: [authorJohnD, authorKurt],
          pairedOn: "2022-05-19T11:16:54+05:30",
        },
        {
          authors: [authorJohnD, authorJohnW],
          pairedOn: "2022-05-19T11:16:54+05:30",
        },
        {
          authors: [authorTony, authorJohnW],
          pairedOn: "2022-04-17T10:16:54+05:30",
        },
        {
          authors: [authorTony, authorJohnW],
          pairedOn: "2022-04-18T10:19:54+05:30",
        },
      ];

      const expectedRecommendation = {
        john: ["tony", "kweller", "jweller"],
        kweller: ["jweller", "tony", "john"],
        jweller: ["kweller", "tony", "john"],
        tony: ["john", "kweller", "jweller"],
      };

      expect(
        pairRecommendationProcessor.generatePairRecommendation(committers)
      ).toEqual(expectedRecommendation);
    });

    it("should generate pair recommendation 2", () => {
      const committers = [
        {
          authors: [authorJohnD, authorKurt],
          pairedOn: "2022-05-19T11:16:54+05:30",
        },
        {
          authors: [authorJohnD, authorKurt],
          pairedOn: "2022-05-18T12:16:54+05:30",
        },
      ];

      const expectedRecommendation = {
        john: ["kweller"],
        kweller: ["john"],
      };

      expect(
        pairRecommendationProcessor.generatePairRecommendation(committers)
      ).toEqual(expectedRecommendation);
    });

    it("should generate pair recommendation 3", () => {
      const committers = [
        {
          authors: [authorJohnD, authorKurt],
          pairedOn: "2022-05-19T11:16:54+05:30",
        },
        {
          authors: [authorJohnD, authorKurt],
          pairedOn: "2022-05-18T12:16:54+05:30",
        },
        {
          authors: [authorKurt, authorTony],
          pairedOn: "2022-05-17T12:16:54+05:30",
        },
      ];

      const expectedRecommendation = {
        john: ["tony", "kweller"],
        kweller: ["tony", "john"],
        tony: ["john", "kweller"],
      };

      expect(
        pairRecommendationProcessor.generatePairRecommendation(committers)
      ).toEqual(expectedRecommendation);
    });
  });
});
