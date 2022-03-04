<template>
  <div id="chord-pairing-chart" />
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ChordPairingChart",
  updated() {
    this.createChart(
      "#chord-pairing-chart",
      this.authors,
      this.data,
      this.width,
      this.height
    );
  },
  methods: {
    createD3Matrix(authors, data) {
      const index = new Map(authors.map((name, i) => [name, i]));
      const matrix = Array.from(index, () => new Array(authors.length).fill(0));

      for (const { author, coAuthor, times } of data) {
        matrix[index.get(author)][index.get(coAuthor)] += times;
      }

      return matrix;
    },
    onMouseOver(event, d) {
      d3.selectAll(`path[co-author='${d.index}']`)
        .attr("stroke", "black")
        .raise();
      d3.selectAll(`path[author='${d.index}']`).attr("stroke", "black").raise();
    },
    onMouseOut(event, d) {
      d3.selectAll(`path[co-author='${d.index}']`).attr("stroke", null);
      d3.selectAll(`path[author='${d.index}']`).attr("stroke", null);
    },
    createChart(targetElement, authors, data, width, height) {
      const svg = d3
        .select(targetElement)
        .append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

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

      const chords = chord(this.createD3Matrix(authors, data));

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
        .on("mouseover", this.onMouseOver)
        .on("mouseout", this.onMouseOut);

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
    },
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    authors: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
