import PairingMatrixProcessor from "../PairingMatrixProcessor.js";

describe("PairingMatrixProcessor", () => {
  const baseCommit = {
    timestamp: "2022-05-19T11:16:54+05:30",
    authorName: "John Doe",
    authorEmail: "john@test.com",
    message: `Introduce test \n Addresses BAH-1571 \n Co-authored-by: Kurt Weller <kweller@test.com>`,
  };

  let pairingMatrixProcessor;

  beforeEach(() => {
    pairingMatrixProcessor = new PairingMatrixProcessor(
      "test",
      ["demo", "demo2"],
      "."
    );
  });

  describe("Reference Extractor", () => {
    it.each([
      ["Addresses BAH-1571", "Addresses", "BAH-1571"],
      ["Addresses BAHA- 1571", "Addresses", "BAHA-"],
      ["[BAHA-1571]", "[BAHA-", "1571]"],
      ["{BAHA-1571}", "{BAHA-", "1571}"],
      ["(BAHA-1571)", "(BAHA-", "1571)"],
      ["[BAHA-1571]", "BAHA-", "1571]"],
      ["[BAHA-1571]", "BAHAA-", undefined],
    ])(
      "should extract card number from commit %s",
      (referenceText, prefix, expectedReference) => {
        const commit = {
          ...baseCommit,
          message: `Introduce test ${referenceText} Co-authored-by: Kurt Weller <kweller@test.com>`,
        };
        const cardNumberReferenceExtractor =
          pairingMatrixProcessor.cardNumberReferenceExtractor(prefix);

        expect(cardNumberReferenceExtractor(commit)).toBe(expectedReference);
      }
    );

    it.each([
      ["2022-05-19T11:16:54+05:30", "2022-05-19"],
      ["2012-09-10T11:16:54+05:30", "2012-09-10"],
      ["2020-01-29T11:16:54+05:30", "2020-01-29"],
    ])(
      "should extract date from commit timestamp %s",
      (timestamp, expectedReference) => {
        const commit = { ...baseCommit, timestamp };

        const daysReferenceExtractor =
          pairingMatrixProcessor.daysReferenceExtractor();

        expect(daysReferenceExtractor(commit)).toBe(expectedReference);
      }
    );
  });

  describe("Extract Committers", () => {
    it("should extract committers using card number reference", () => {
      const cardNumberReferenceExtractor =
        pairingMatrixProcessor.cardNumberReferenceExtractor("Addresses");

      const expectedCommitters = [
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
          ],
          reference: "BAH-1571",
        },
      ];

      expect(
        pairingMatrixProcessor.extractCommitters(
          [{ ...baseCommit }],
          cardNumberReferenceExtractor
        )
      ).toEqual(expectedCommitters);
    });

    it("should extract committers using date reference", () => {
      const daysReferenceExtractor =
        pairingMatrixProcessor.daysReferenceExtractor();

      const expectedCommitters = [
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
          ],
          reference: "2022-05-19",
        },
      ];

      expect(
        pairingMatrixProcessor.extractCommitters(
          [{ ...baseCommit }],
          daysReferenceExtractor
        )
      ).toEqual(expectedCommitters);
    });

    it("should extract committers with multiple co-authors", () => {
      const commit = {
        ...baseCommit,
        message: `Introduce test \n Addresses BAH-1571 \n Co-authored-by: Kurt Weller <kweller@test.com> \n Co-authored-by: Tony Stark <TonY@teSt.com>`,
      };
      const daysReferenceExtractor =
        pairingMatrixProcessor.daysReferenceExtractor();

      const expectedCommitters = [
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
            { authorName: "Tony Stark", authorEmail: "tony@test.com" },
          ],
          reference: "2022-05-19",
        },
      ];

      expect(
        pairingMatrixProcessor.extractCommitters(
          [commit],
          daysReferenceExtractor
        )
      ).toEqual(expect.arrayContaining(expectedCommitters));
    });

    it("should have only one author name if there is not co-author present", () => {
      const commit = { ...baseCommit, message: `Introduce test` };
      const daysReferenceExtractor =
        pairingMatrixProcessor.daysReferenceExtractor();

      const expectedCommitters = [
        {
          authors: [{ authorName: "John Doe", authorEmail: "john@test.com" }],
          reference: "2022-05-19",
        },
      ];

      expect(
        pairingMatrixProcessor.extractCommitters(
          [commit],
          daysReferenceExtractor
        )
      ).toEqual(expectedCommitters);
    });

    it("should extract committers even if co-authors doesn't have email id", () => {
      const commit = {
        ...baseCommit,
        message: `Introduce test \n Addresses BAH-1571 \n Co-authored-by: Kurt Weller`,
      };
      const daysReferenceExtractor =
        pairingMatrixProcessor.daysReferenceExtractor();

      const expectedCommitters = [
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller" },
          ],
          reference: "2022-05-19",
        },
      ];

      expect(
        pairingMatrixProcessor.extractCommitters(
          [commit],
          daysReferenceExtractor
        )
      ).toEqual(expect.arrayContaining(expectedCommitters));
    });

    it.each([[undefined], [""]])(
      "should return empty list if message is '%s'",
      (message) => {
        const commit = { ...baseCommit, message };
        const daysReferenceExtractor =
          pairingMatrixProcessor.daysReferenceExtractor();

        expect(
          pairingMatrixProcessor.extractCommitters(
            [commit],
            daysReferenceExtractor
          )
        ).toEqual([]);
      }
    );
  });

  describe("Extract Paired Committers", () => {
    it("should extract pair committers", () => {
      const committers = [
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
            { authorName: "Tony Stark", authorEmail: "tony@test.com" },
            { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [{ authorName: "John Doe", authorEmail: "john@test.com" }],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "Tony Stark", authorEmail: "tony@test.com" },
            { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
          ],
          reference: "4/18/2022",
        },
      ];

      const expectedPairCommitters = [
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Tony Stark", authorEmail: "tony@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
            { authorName: "Tony Stark", authorEmail: "tony@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
            { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "Tony Stark", authorEmail: "tony@test.com" },
            { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
          ],
          reference: "2022-05-19",
        },
        {
          authors: [
            { authorName: "Tony Stark", authorEmail: "tony@test.com" },
            { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
          ],
          reference: "4/18/2022",
        },
      ];

      expect(
        pairingMatrixProcessor.extractPairedCommitters(committers)
      ).toEqual(expect.arrayContaining(expectedPairCommitters));
    });

    it("should ignore committers information if co-author email doesn't exists", () => {
      const committers = [
        {
          authors: [
            { authorName: "John Doe", authorEmail: "john@test.com" },
            { authorName: "Kurt Weller" },
          ],
          reference: "2022-05-19",
        },
      ];

      expect(
        pairingMatrixProcessor.extractPairedCommitters(committers)
      ).toEqual([]);
    });
  });

  it("should create pairing matrix for given committers information", () => {
    const committers = [
      {
        authors: [
          { authorName: "John Doe", authorEmail: "john@test.com" },
          { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
        ],
        reference: "2022-05-19",
      },
      {
        authors: [
          { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
          { authorName: "Tony Stark", authorEmail: "tony@test.com" },
        ],
        reference: "2022-05-19",
      },
      {
        authors: [
          { authorName: "John Doe", authorEmail: "john@test.com" },
          { authorName: "Kurt Weller", authorEmail: "kweller@test.com" },
        ],
        reference: "2022-05-19",
      },
      {
        authors: [
          { authorName: "John Doe", authorEmail: "john@test.com" },
          { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
        ],
        reference: "2022-05-19",
      },
      {
        authors: [
          { authorName: "Tony Stark", authorEmail: "tony@test.com" },
          { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
        ],
        reference: "4/17/2022",
      },
      {
        authors: [
          { authorName: "Tony Stark", authorEmail: "tony@test.com" },
          { authorName: "Steve Rogers", authorEmail: "srogers@test.com" },
        ],
        reference: "4/18/2022",
      },
    ];

    const expectedPairingMatrix = [
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

    expect(pairingMatrixProcessor.createPairingMatrix(committers)).toEqual(
      expect.arrayContaining(expectedPairingMatrix)
    );
  });

  it("should find unique authors from pairing matrix", () => {
    const pairingMatrix = [
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

    const expectedAuthors = ["john", "kweller", "tony", "srogers"];

    expect(pairingMatrixProcessor.findUniqueAuthors(pairingMatrix)).toEqual(
      expect.arrayContaining(expectedAuthors)
    );
  });
});
