<template>
  <div id="chord-pairing-chart" />
</template>

<script>
import { ChordChart } from "pairing-matrix-charts";

export default {
  name: "ChordPairingChart",
  data() {
    return {
      chordChart: new ChordChart(),
    };
  },
  updated() {
    this.renderChart();
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      this.chordChart.createChart(
        "#chord-pairing-chart",
        this.authors,
        this.data,
        this.width,
        this.height
      );
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
