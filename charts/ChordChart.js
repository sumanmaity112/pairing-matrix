import * as d3 from "d3";
import { createD3Matrix } from "./chartsUtil.js";

export default class ChordChart {
  constructor() {}

  static #onMouseOver(event, d) {
    d3.selectAll(`path[co-author='${d.index}']`)
      .attr("stroke", "black")
      .raise();
    d3.selectAll(`path[author='${d.index}']`).attr("stroke", "black").raise();
  }

  static #onMouseOut(event, d) {
    d3.selectAll(`path[co-author='${d.index}']`).attr("stroke", null);
    d3.selectAll(`path[author='${d.index}']`).attr("stroke", null);
  }

  createChart(targetElement, authors, data, width, height) {
    if (authors.length === 0 || data.length === 0) return;

    const domElement = d3.select(targetElement);
    domElement.selectAll(`svg[svg-for='pairing-matrix-chord-chart']`).remove();

    const svg = domElement
      .append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("svg-for", "pairing-matrix-chord-chart");

    const innerRadius = Math.min(width, height) * 0.5 - 150;
    const outerRadius = innerRadius + 10;

    const chord = d3
      .chordDirected()
      .padAngle(10 / innerRadius)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    const ribbon = d3
      .ribbonArrow()
      .radius(innerRadius - 1)
      .padAngle(1 / innerRadius);

    const color = d3.scaleOrdinal(
      authors,
      d3.quantize(d3.interpolateRainbow, authors.length)
    );

    const chords = chord(createD3Matrix(authors, data));

    const group = svg
      .append("g")
      .attr("font-size", 20)
      .attr("font-family", "sans-serif")
      .selectAll("g")
      .data(chords.groups)
      .join("g");

    group
      .append("path")
      .attr("fill", (d) => color(authors[d.index]))
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
      .text((d) => authors[d.index])
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
      .attr("fill", (d) => color(authors[d.target.index]))
      .attr("d", ribbon)
      .attr("co-author", (d) => d.target.index)
      .attr("author", (d) => d.source.index)
      .append("title")
      .text(
        (d) =>
          `${authors[d.source.index]} → ${authors[d.target.index]} ${
            d.source.value
          }`
      );

    return svg;
  }
}
