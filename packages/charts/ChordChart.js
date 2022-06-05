import { selectAll as d3SelectAll, select as d3Select } from "d3-selection";
import {
  chordDirected as d3ChordDirected,
  ribbonArrow as d3RibbonArrow,
} from "d3-chord";
import { scaleOrdinal as d3ScaleOrdinal } from "d3-scale";
import { quantize as d3Quantize } from "d3-interpolate";
import { arc as d3Arc } from "d3-shape";
import { interpolateRainbow as d3InterpolateRainbow } from "d3-scale-chromatic";
import { descending as d3Descending } from "d3-array";
import { createD3Matrix } from "./chartsUtil.js";

export default class ChordChart {
  constructor() {}

  static #onMouseOver(event, d) {
    d3SelectAll(`path[co-author='${d.index}']`).attr("stroke", "black").raise();
    d3SelectAll(`path[author='${d.index}']`).attr("stroke", "black").raise();
  }

  static #onMouseOut(event, d) {
    d3SelectAll(`path[co-author='${d.index}']`).attr("stroke", null);
    d3SelectAll(`path[author='${d.index}']`).attr("stroke", null);
  }

  createChart(targetElement, authors, data, width, height) {
    const sortedAuthors = authors.sort();
    if (sortedAuthors.length === 0 || data.length === 0) return;

    const domElement = d3Select(targetElement);
    domElement.selectAll(`svg[svg-for='pairing-matrix-chord-chart']`).remove();

    const svg = domElement
      .append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("svg-for", "pairing-matrix-chord-chart");

    const innerRadius = Math.min(width, height) * 0.5 - 150;
    const outerRadius = innerRadius + 10;

    const chord = d3ChordDirected()
      .padAngle(10 / innerRadius)
      .sortSubgroups(d3Descending)
      .sortChords(d3Descending);

    const arc = d3Arc().innerRadius(innerRadius).outerRadius(outerRadius);

    const ribbon = d3RibbonArrow()
      .radius(innerRadius - 1)
      .padAngle(1 / innerRadius);

    const color = d3ScaleOrdinal(
      sortedAuthors,
      d3Quantize(d3InterpolateRainbow, sortedAuthors.length)
    );

    const chords = chord(createD3Matrix(sortedAuthors, data));

    const group = svg
      .append("g")
      .attr("font-size", 20)
      .attr("font-family", "sans-serif")
      .selectAll("g")
      .data(chords.groups)
      .join("g");

    group
      .append("path")
      .attr("fill", (d) => color(sortedAuthors[d.index]))
      .attr("d", arc);

    group
      .append("text")
      .each((d) => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr("dy", "0.35em")
      .attr(
        "transform",
        (d) => `
        rotate(${(d.angle * 180) / Math.PI - 90})
        translate(${outerRadius + 5})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `
      )
      .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : null))
      .text((d) => sortedAuthors[d.index])
      .on("mouseover", ChordChart.#onMouseOver)
      .on("mouseout", ChordChart.#onMouseOut);

    svg
      .append("g")
      .attr("fill-opacity", 0.75)
      .selectAll("path")
      .data(chords)
      .join("path")
      .style("stroke-width", "3px")
      .style("mix-blend-mode", "multiply")
      .attr("fill", (d) => color(sortedAuthors[d.target.index]))
      .attr("d", ribbon)
      .attr("co-author", (d) => d.target.index)
      .attr("author", (d) => d.source.index)
      .append("title")
      .text(
        (d) =>
          `${sortedAuthors[d.source.index]} → ${
            sortedAuthors[d.target.index]
          } ${d.source.value}`
      );

    return svg;
  }
}
