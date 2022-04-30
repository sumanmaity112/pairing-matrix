import * as d3 from "d3";
import { createD3Matrix } from "./chartsUtil.js";

export default class TabularChart {
  constructor() {}

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
    const paddingBetweenElements = 50;
    const committersNameTopStartingPositionY = -height / 2 + 150;
    const committersNameTopStartingPositionX = -height / 2 + 100;

    const svg = d3
      .select(targetElement)
      .append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    TabularChart.#appendNamesOnTop(
      svg,
      authors,
      committersNameTopStartingPositionX,
      paddingBetweenElements,
      committersNameTopStartingPositionY
    );

    TabularChart.#appendMatrixAlongWithNameOnSide(
      height,
      svg,
      authors,
      data,
      width,
      paddingBetweenElements
    );

    svg.selectAll("text").attr("font-size", 18).attr("font-family", "fantasy");

    return svg;
  }

  static #appendMatrixAlongWithNameOnSide(
    height,
    svg,
    authors,
    data,
    width,
    paddingBetweenElements
  ) {
    const rectangleHeight = 40;
    const rectangleWidth = 40;
    const committersNameSideStartingXPosition = height / 2 - 175;
    const pairingRowStartingYPosition = -height / 2 + 125;
    const paddingBetweenGroupElements = 25;
    const rectangleStartingXPosition =
      committersNameSideStartingXPosition - paddingBetweenGroupElements;

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
          `translate(${-width / 2}, ${
            pairingRowStartingYPosition + paddingBetweenElements * (index + 1)
          })`
      );

    TabularChart.#appendNameOnSide(
      table,
      authors,
      rectangleHeight,
      committersNameSideStartingXPosition
    );

    const row = table.append("g");

    TabularChart.#appendColumns(
      row,
      authors,
      rectangleStartingXPosition,
      paddingBetweenElements,
      rectangleWidth,
      rectangleHeight
    );

    TabularChart.#appendPairCountOnColumns(
      row,
      authors,
      rectangleStartingXPosition,
      rectangleWidth,
      paddingBetweenElements,
      rectangleHeight
    );
  }

  static #appendPairCountOnColumns(
    row,
    authors,
    rectangleStartingXPosition,
    rectangleWidth,
    paddingBetweenElements,
    rectangleHeight
  ) {
    row
      .append("g")
      .attr("author", (element, index) => authors[index])
      .selectAll("text")
      .data((elements, index) => {
        const data = TabularChart.#deepCopyArray(elements).reverse();
        return index === 0 ? data : data.slice(0, -index);
      })
      .enter()
      .append("text")
      .text((element, index, elements) => {
        return elements.length - 1 === index ? ":)" : element;
      })
      .attr(
        "co-author",
        (element, index) =>
          TabularChart.#deepCopyArray(authors).reverse()[index]
      )
      .attr(
        "x",
        (d, index) =>
          rectangleStartingXPosition +
          rectangleWidth / 2 +
          paddingBetweenElements * (index + 1)
      )
      .attr("y", rectangleHeight / 2)
      .attr("alignment-baseline", "middle")
      .on("mouseover", TabularChart.#onMouseOver)
      .on("mouseout", TabularChart.#onMouseOut);
  }

  static #appendColumns(
    row,
    authors,
    rectangleStartingXPosition,
    paddingBetweenElements,
    rectangleWidth,
    rectangleHeight
  ) {
    row
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
      .attr(
        "x",
        (d, index) =>
          rectangleStartingXPosition + paddingBetweenElements * (index + 1)
      )
      .style("outline", "2px solid chocolate")
      .style("border-radius", "6px")
      .attr("fill", "white")
      .attr("width", rectangleWidth)
      .attr("height", rectangleHeight)
      .on("mouseover", TabularChart.#onMouseOver)
      .on("mouseout", TabularChart.#onMouseOut);
  }

  static #deepCopyArray(elements) {
    return [].concat(elements);
  }

  static #appendNameOnSide(
    enter,
    authors,
    rectangleHeight,
    committersNameSideStartingXPosition
  ) {
    enter
      .append("text")
      .text((element, index) => authors[index])
      .attr("author", (element, index) => authors[index])
      .attr("y", rectangleHeight / 2)
      .attr("x", committersNameSideStartingXPosition)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle");
  }

  static #appendNamesOnTop(
    svg,
    authors,
    committersNameTopStartingPositionX,
    paddingBetweenElements,
    committersNameTopStartingPositionY
  ) {
    svg
      .append("g")
      .attr("location", "top")
      .selectAll("g")
      .append("g")
      .data(() => TabularChart.#deepCopyArray(authors).reverse())
      .enter()
      .append("text")
      .text((element) => element)
      .attr("co-author", (element) => element)
      .attr(
        "transform",
        (d, index) =>
          `translate(${
            committersNameTopStartingPositionX +
            paddingBetweenElements * (index + 1)
          }, ${committersNameTopStartingPositionY}) rotate(270)`
      );
  }
}
