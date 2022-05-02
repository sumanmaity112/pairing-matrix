import * as d3 from "d3";
import { createD3Matrix } from "./chartsUtil.js";

export default class TabularChart {
  constructor() {}

  static #deepCopyArray(elements) {
    return [].concat(elements);
  }

  static #getElementsForHoverEffect(self) {
    const author = d3.select(self.parentNode).attr("author");
    const coAuthor = d3.select(self).attr("co-author");

    return [
      d3
        .selectAll("g[location='top']")
        .selectAll(`text[co-author='${coAuthor}']`),
      d3.selectAll("g[location='side']").selectAll(`text[author='${author}']`),
    ];
  }

  static #onMouseOver() {
    TabularChart.#getElementsForHoverEffect(this).forEach((element) =>
      element
        .attr("font-weight", "bold")
        .style("text-shadow", "6px 6px #A9A9A9")
        .raise()
    );
  }

  static #onMouseOut() {
    TabularChart.#getElementsForHoverEffect(this).forEach((element) =>
      element.attr("font-weight", "normal").style("text-shadow", null)
    );
  }

  createChart(targetElement, authors, data, width, height) {
    if (authors.length === 0 || data.length === 0) return;

    const domElement = d3.select(targetElement);
    domElement
      .selectAll(`svg[svg-for='pairing-matrix-tabular-chart']`)
      .remove();

    const svg = domElement
      .append("svg")
      .attr("viewBox", [-width, -height, width, height])
      .attr("svg-for", "pairing-matrix-tabular-chart");

    this.appendNameOnTop(svg, authors, height, width);
    this.appendTableAlongWithNameOnSide(svg, authors, data, height, width);

    svg.selectAll("text").attr("font-size", 18).attr("font-family", "fantasy");
  }

  appendTableAlongWithNameOnSide(svg, authors, data, height, width) {
    const tableStartPositionX = this.getTableStartPositionX(width);
    const tableStartPositionY = this.getTableStartPositionY(height);
    const boxHeight = this.getBoxHeight();
    const paddingBetweenBox = this.getPaddingBetweenBox();

    const table = svg
      .append("g")
      .attr("location", "side")
      .selectAll("g")
      .data(createD3Matrix(authors, data))
      .enter()
      .append("g")
      .attr(
        "transform",
        (d, index) =>
          `translate(${tableStartPositionX}, ${
            tableStartPositionY + boxHeight * index + paddingBetweenBox * index
          })`
      );

    this.appendNameOnSide(table, authors);
    this.appendColumns(table, authors);
    this.appendPairCount(table, authors);
  }

  appendPairCount(table, authors) {
    const boxWidth = this.getBoxWidth();
    const boxHeight = this.getBoxHeight();
    const paddingBetweenBox = this.getPaddingBetweenBox();

    table
      .append("g")
      .attr("author", (element, index) => authors[index])
      .selectAll("text")
      .data((elements, index) => {
        const data = TabularChart.#deepCopyArray(elements).reverse();
        return index === 0 ? data : data.slice(0, -index);
      })
      .enter()
      .append("text")
      .text((element, index, elements) =>
        elements.length - 1 === index ? ":)" : element
      )
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
      .on("mouseover", TabularChart.#onMouseOver)
      .on("mouseout", TabularChart.#onMouseOut);
  }

  getDigitWidth() {
    return 5;
  }

  appendColumns(table, authors) {
    const boxWidth = this.getBoxWidth();
    const boxHeight = this.getBoxHeight();
    const paddingBetweenBox = this.getPaddingBetweenBox();

    table
      .append("g")
      .attr("author", (element, index) => authors[index])
      .selectAll("rect")
      .data((elements, index) =>
        index === 0
          ? elements
          : TabularChart.#deepCopyArray(elements).slice(0, -index)
      )
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
      .on("mouseover", TabularChart.#onMouseOver)
      .on("mouseout", TabularChart.#onMouseOut);
  }

  appendNameOnSide(table, authors) {
    const boxHeight = this.getBoxHeight();
    const paddingBetweenNameAndTable = this.getPaddingBetweenNameAndTable();

    table
      .append("text")
      .text((element, index) => authors[index])
      .attr("author", (element, index) => authors[index])
      .attr("x", -paddingBetweenNameAndTable)
      .attr("y", boxHeight / 2)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle");
  }

  appendNameOnTop(svg, authors, height, width) {
    const tableStartPositionX = this.getTableStartPositionX(width);
    const tableStartPositionY = this.getTableStartPositionY(height);

    const nameStartingPositionY =
      tableStartPositionY - this.getPaddingBetweenNameAndTable();
    const boxWidth = this.getBoxWidth();
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
      );
  }

  getPaddingBetweenBox() {
    return 10;
  }

  getBoxHeight() {
    return 40;
  }

  getBoxWidth() {
    return 40;
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
