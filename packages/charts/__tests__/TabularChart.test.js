import { pairingMatrix } from "./data/testData.js";
import TabularChart from "../TabularChart.js";
import { simulateMouseOut, simulateMouseOver } from "./testUtil.js";

describe("Tabular Chart", () => {
  const targetElementId = "#tabular-chart";

  let tabularChart;

  beforeEach(() => {
    tabularChart = new TabularChart();
    document.body.innerHTML = `<div><div id="tabular-chart" /></div>`;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should return undefined when authors is empty", () => {
    const { matrix } = pairingMatrix;
    tabularChart.createChart(targetElementId, [], matrix, 100, 110);

    expect(document.querySelector(targetElementId).innerHTML).toBe("");
  });

  it("should return undefined when matrix is empty", () => {
    const { authors } = pairingMatrix;
    tabularChart.createChart(targetElementId, authors, [], 100, 110);

    expect(document.querySelector(targetElementId).innerHTML).toBe("");
  });

  it.each([
    [500, 500],
    [600, 500],
    [500, 600],
  ])("should generate tabular chart for %d x %d", (height, width) => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, height, width);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");
    expect(document.body).toMatchSnapshot();
  });

  it("should not add duplicate tabular chart svg on re-rendering", () => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, 500, 600);
    tabularChart.createChart(targetElementId, authors, matrix, 700, 600);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");

    expect(document.body).toMatchSnapshot();
  });

  it("should highlight author names on mouse over on cell", () => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, 600, 500);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");

    simulateMouseOver(
      "#tabular-chart > svg > g:nth-child(2) > g:nth-child(4) > g:nth-child(2) > rect:nth-child(2)"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should remove highlight from author names on mouse out on cell", () => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, 600, 500);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");

    simulateMouseOver(
      "#tabular-chart > svg > g:nth-child(2) > g:nth-child(4) > g:nth-child(2) > rect:nth-child(2)"
    );

    expect(document.body).toMatchSnapshot();

    simulateMouseOut(
      "#tabular-chart > svg > g:nth-child(2) > g:nth-child(4) > g:nth-child(2) > rect:nth-child(2)"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should highlight cells on mouse over on author name on the side bar", () => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, 600, 500);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");

    simulateMouseOver(
      "#tabular-chart > svg > g:nth-child(2) > g:nth-child(6) > text"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should remove highlight from cells on mouse out on author name on the side bar", () => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, 600, 500);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");

    simulateMouseOver(
      "#tabular-chart > svg > g:nth-child(2) > g:nth-child(6) > text"
    );

    expect(document.body).toMatchSnapshot();

    simulateMouseOut(
      "#tabular-chart > svg > g:nth-child(2) > g:nth-child(6) > text"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should highlight cells on mouse over on author name on the top bar", () => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, 600, 500);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");

    simulateMouseOver(
      "#tabular-chart > svg > g:nth-child(1) > text:nth-child(6)"
    );

    expect(document.body).toMatchSnapshot();
  });

  it("should remove highlight from cells on mouse out on author name on the top bar", () => {
    const { authors, matrix } = pairingMatrix;

    tabularChart.createChart(targetElementId, authors, matrix, 600, 500);

    expect(document.querySelector(targetElementId).innerHTML).not.toBe("");

    simulateMouseOver(
      "#tabular-chart > svg > g:nth-child(1) > text:nth-child(6)"
    );

    expect(document.body).toMatchSnapshot();

    simulateMouseOut(
      "#tabular-chart > svg > g:nth-child(1) > text:nth-child(6)"
    );

    expect(document.body).toMatchSnapshot();
  });
});
