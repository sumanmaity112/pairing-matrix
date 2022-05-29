import { createD3Matrix } from "../chartsUtil.js";
import { pairingMatrix } from "./data/testData.js";

describe("Chart Utils", () => {
  it("should create pairing matrix", () => {
    const matrix = [
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
    const authors = ["john", "kweller", "tony", "srogers"];

    const expectedD3Matrix = [
      [0, 1, 0, 1],
      [0, 0, 1, 0],
      [0, 0, 0, 2],
      [0, 0, 0, 0],
    ];

    expect(createD3Matrix(authors, matrix)).toEqual(expectedD3Matrix);
  });

  it("should create d3 pairing matrix", () => {
    const { matrix, authors } = pairingMatrix;

    const expectedD3Matrix = [
      [0, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    expect(createD3Matrix(authors, matrix)).toEqual(expectedD3Matrix);
  });
});
