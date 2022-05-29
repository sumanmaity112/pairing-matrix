import ChordChart from "../ChordChart.js";
import { pairingMatrix } from "./data/testData.js";
import { simulateMouseOut, simulateMouseOver } from "./testUtil.js";

describe("Chord Chart", () => {
  const targetElementId = "#chord-chart";

  let chordChart;

  beforeEach(() => {
    chordChart = new ChordChart();
    document.body.innerHTML = `<div><div id="chord-chart" /></div>`;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should return undefined when authors is empty", () => {
    const { matrix } = pairingMatrix;

    expect(
      chordChart.createChart(targetElementId, [], matrix, 100, 110)
    ).toBeUndefined();
  });

  it("should return undefined when matrix is empty", () => {
    const { authors } = pairingMatrix;

    expect(
      chordChart.createChart(targetElementId, authors, [], 100, 110)
    ).toBeUndefined();
  });

  it.each([
    [500, 500],
    [600, 500],
    [500, 600],
  ])("should generate chord chart for %d x %d", (height, width) => {
    const { authors, matrix } = pairingMatrix;

    const chart = chordChart.createChart(
      targetElementId,
      authors,
      matrix,
      height,
      width
    );

    expect(chart).not.toBeUndefined();
    expect(document.body).toMatchSnapshot();
  });

  it("should not add duplicate chord chart svg on re-rendering", () => {
    const { authors, matrix } = pairingMatrix;

    const firstChart = chordChart.createChart(
      targetElementId,
      authors,
      matrix,
      500,
      600
    );
    const secondChart = chordChart.createChart(
      targetElementId,
      authors,
      matrix,
      700,
      600
    );

    expect(firstChart).not.toBeUndefined();
    expect(secondChart).not.toBeUndefined();
    expect(document.body).toMatchSnapshot();
  });

  it("should highlight chords when hover on author name", () => {
    const { authors, matrix } = pairingMatrix;

    const chart = chordChart.createChart(
      targetElementId,
      authors,
      matrix,
      600,
      500
    );

    expect(chart).not.toBeUndefined();

    simulateMouseOver(
      "#chord-chart > svg > g:nth-child(1) > g:nth-child(9) > text"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should remove highlight effects on mouse out from author name", () => {
    const { authors, matrix } = pairingMatrix;

    const chart = chordChart.createChart(
      targetElementId,
      authors,
      matrix,
      600,
      500
    );

    expect(chart).not.toBeUndefined();

    simulateMouseOver(
      "#chord-chart > svg > g:nth-child(1) > g:nth-child(9) > text"
    );

    expect(document.body).toMatchSnapshot();

    simulateMouseOut(
      "#chord-chart > svg > g:nth-child(1) > g:nth-child(9) > text"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should display pair count on hover on chord", () => {
    const { authors, matrix } = pairingMatrix;

    const chart = chordChart.createChart(
      targetElementId,
      authors,
      matrix,
      600,
      500
    );

    expect(chart).not.toBeUndefined();

    simulateMouseOver(
      "#chord-chart > svg > g:nth-child(2) > path:nth-child(4)"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should hide pair count on mouse out from chord", () => {
    const { authors, matrix } = pairingMatrix;

    const chart = chordChart.createChart(
      targetElementId,
      authors,
      matrix,
      600,
      500
    );

    expect(chart).not.toBeUndefined();

    simulateMouseOver(
      "#chord-chart > svg > g:nth-child(2) > path:nth-child(4)"
    );

    expect(document.body).toMatchSnapshot();

    simulateMouseOut("#chord-chart > svg > g:nth-child(2) > path:nth-child(4)");

    expect(document.body).toMatchSnapshot();
  });
});
