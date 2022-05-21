import * as d3 from "d3";
import { createD3Matrix } from "./chartsUtil.js";

export default class TabularChart {
  constructor() {}

  static #deepCopyArray(elements) {
    return [].concat(elements);
  }

  static #getElementsForCellHoverEffect(self) {
    const author = d3.select(self.parentNode).attr("author");
    const coAuthor = d3.select(self).attr("co-author");

    return [
      d3
        .selectAll("g[location='top']")
        .selectAll(`text[co-author='${coAuthor}']`),
      d3.selectAll("g[location='side']").selectAll(`text[author='${author}']`),
    ];
  }

  static #onCellMouseOver() {
    TabularChart.#mouseOverEffect(
      TabularChart.#getElementsForCellHoverEffect(this)
    );
  }

  static #onCellMouseOut() {
    TabularChart.#mouseOutEffect(
      TabularChart.#getElementsForCellHoverEffect(this)
    );
  }

  static #mouseOverEffect(elements) {
    elements.forEach((element) =>
      element
        .attr("font-weight", "bold")
        .style("text-shadow", "6px 6px #A9A9A9")
        .raise()
    );
  }

  static #mouseOutEffect(elements) {
    elements.forEach((element) =>
      element.attr("font-weight", "normal").style("text-shadow", null)
    );
  }

  static #getElementsForPairIdentityHoverEffect(self) {
    const author = d3.select(self).attr("author");

    if (author) {
      return [
        d3.selectAll(`text[co-author='${author}']`),
        d3.selectAll(`g[author='${author}']`).selectAll("text"),
        d3.selectAll(`text[author='${author}']`),
      ];
    }

    const coAuthor = d3.select(self).attr("co-author");

    return [
      d3.selectAll(`text[co-author='${coAuthor}']`),
      d3.selectAll(`g[author='${coAuthor}']`).selectAll("text"),
      d3.selectAll(`text[author='${coAuthor}']`),
    ];
  }

  static #onPairIdentityMouseOver() {
    TabularChart.#mouseOverEffect(
      TabularChart.#getElementsForPairIdentityHoverEffect(this)
    );
  }

  static #onPairIdentityMouseOut() {
    TabularChart.#mouseOutEffect(
      TabularChart.#getElementsForPairIdentityHoverEffect(this)
    );
  }

  static #createD3Matrix(authors, data) {
    const d3Matrix = createD3Matrix(authors, data);
    const matrix = [];
    for (let i = 0; i < authors.length; i++) {
      const row = d3Matrix[i];
      matrix[i] = [];

      for (let j = authors.length - 1; j >= 0; j--) {
        const cellValue = row[j];
        if (j >= i) matrix[i][authors.length - 1 - j] = cellValue;
        else {
          matrix[j][authors.length - 1 - i] += cellValue;
        }
      }
    }

    return matrix;
  }

  createChart(targetElement, authors, data, width, height) {
    if (authors.length === 0 || data.length === 0) return;

    const sortedAuthors = authors.sort();

    const domElement = d3.select(targetElement);
    domElement
      .selectAll(`svg[svg-for='pairing-matrix-tabular-chart']`)
      .remove();

    const svg = domElement
      .append("svg")
      .attr("viewBox", [-width, -height, width, height])
      .attr("svg-for", "pairing-matrix-tabular-chart");

    this.appendNameOnTop(svg, sortedAuthors, height, width);
    this.appendTableAlongWithNameOnSide(
      svg,
      sortedAuthors,
      data,
      height,
      width
    );

    svg.selectAll("text").attr("font-size", 18).attr("font-family", "fantasy");
  }

  appendTableAlongWithNameOnSide(svg, authors, data, height, width) {
    const tableStartPositionX = this.getTableStartPositionX(width);
    const tableStartPositionY = this.getTableStartPositionY(height);
    const boxHeight = this.getBoxHeight(authors, width, height);
    const paddingBetweenBox = this.getPaddingBetweenBox();

    const table = svg
      .append("g")
      .attr("location", "side")
      .selectAll("g")
      .data(TabularChart.#createD3Matrix(authors, data))
      .enter()
      .append("g")
      .attr(
        "transform",
        (d, index) =>
          `translate(${tableStartPositionX}, ${
            tableStartPositionY + boxHeight * index + paddingBetweenBox * index
          })`
      );

    this.appendNameOnSide(table, authors, width, height);
    this.appendColumns(table, authors, width, height);
    this.appendPairCount(table, authors, width, height);
  }

  appendPairCount(table, authors, width, height) {
    const boxWidth = this.getBoxWidth(authors, width, height);
    const boxHeight = this.getBoxHeight(authors, width, height);
    const paddingBetweenBox = this.getPaddingBetweenBox();

    table
      .append("g")
      .attr("author", (element, index) => authors[index])
      .selectAll("text")
      .data((elements, index) => TabularChart.#deepCopyArray(elements))
      .enter()
      .append("text")
      .text((element, index, elements) => {
        if (elements.length - 1 === index) return ":)";
        return element === 0 ? "-" : element;
      })
      .attr(
        "co-author",
        (element, index) =>
          TabularChart.#deepCopyArray(authors).reverse()[index]
      )
      .attr(
        "x",
        (d, index) =>
          boxWidth * index +
          paddingBetweenBox * index +
          boxWidth / 2 -
          this.getDigitWidth()
      )
      .attr("y", boxHeight / 2)
      .attr("alignment-baseline", "middle")
      .on("mouseover", TabularChart.#onCellMouseOver)
      .on("mouseout", TabularChart.#onCellMouseOut);
  }

  getDigitWidth() {
    return 5;
  }

  appendColumns(table, authors, width, height) {
    const boxWidth = this.getBoxWidth(authors, width, height);
    const boxHeight = this.getBoxHeight(authors, width, height);
    const paddingBetweenBox = this.getPaddingBetweenBox();

    table
      .append("g")
      .attr("author", (element, index) => authors[index])
      .selectAll("rect")
      .data((elements, index) => elements)
      .enter()
      .append("rect")
      .attr(
        "co-author",
        (element, index) =>
          TabularChart.#deepCopyArray(authors).reverse()[index]
      )
      .attr("x", (d, index) => boxWidth * index + paddingBetweenBox * index)
      .style("outline", "2px solid chocolate")
      .style("border-radius", "6px")
      .attr("fill", "white")
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .on("mouseover", TabularChart.#onCellMouseOver)
      .on("mouseout", TabularChart.#onCellMouseOut);
  }

  appendNameOnSide(table, authors, width, height) {
    const boxHeight = this.getBoxHeight(authors, width, height);
    const paddingBetweenNameAndTable = this.getPaddingBetweenNameAndTable();

    table
      .append("text")
      .text((element, index) => authors[index])
      .attr("author", (element, index) => authors[index])
      .attr("x", -paddingBetweenNameAndTable)
      .attr("y", boxHeight / 2)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .on("mouseover", TabularChart.#onPairIdentityMouseOver)
      .on("mouseout", TabularChart.#onPairIdentityMouseOut);
  }

  appendNameOnTop(svg, authors, height, width) {
    const tableStartPositionX = this.getTableStartPositionX(width);
    const tableStartPositionY = this.getTableStartPositionY(height);

    const nameStartingPositionY =
      tableStartPositionY - this.getPaddingBetweenNameAndTable();
    const boxWidth = this.getBoxWidth(authors, width, height);
    const paddingBetweenBox = this.getPaddingBetweenBox();
    svg
      .append("g")
      .attr("location", "top")
      .selectAll("text")
      .data(() => TabularChart.#deepCopyArray(authors).reverse())
      .enter()
      .append("text")
      .text((element) => element)
      .attr("co-author", (element) => element)
      .attr(
        "transform",
        (d, index) =>
          `translate( ${
            tableStartPositionX +
            boxWidth * index +
            paddingBetweenBox * index +
            boxWidth / 2
          } , ${nameStartingPositionY}) rotate(270)`
      )
      .on("mouseover", TabularChart.#onPairIdentityMouseOver)
      .on("mouseout", TabularChart.#onPairIdentityMouseOut);
  }

  getPaddingBetweenBox() {
    return 10;
  }

  getBoxHeight(authors, width, height) {
    return (
      (height * 1 -
        this.getWidthForNames() -
        this.getPaddingBetweenNameAndTable() -
        this.getPaddingBetweenBox() * authors.length) /
      authors.length
    );
  }

  getBoxWidth(authors, width, height) {
    return (
      (width * 1 -
        this.getWidthForNames() -
        this.getPaddingBetweenNameAndTable() -
        this.getPaddingBetweenBox() * authors.length) /
      authors.length
    );
  }

  getTableStartPositionX(width) {
    const widthForNames = this.getWidthForNames();
    const paddingBetweenNameAndTable = this.getPaddingBetweenNameAndTable();

    return -(width - widthForNames - paddingBetweenNameAndTable);
  }

  getPaddingBetweenNameAndTable() {
    return 25;
  }

  getWidthForNames() {
    return 150;
  }

  getTableStartPositionY(height) {
    const widthForNames = this.getWidthForNames();
    const paddingBetweenNameAndTable = this.getPaddingBetweenNameAndTable();

    return -(height - widthForNames - paddingBetweenNameAndTable);
  }
}
