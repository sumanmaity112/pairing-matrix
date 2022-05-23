<template>
  <div id="tabular-pairing-chart" />
</template>

<script>
import { TabularChart } from "pairing-matrix-charts";

export default {
  name: "TabularPairingChart",
  data() {
    return {
      tabularChart: new TabularChart(),
    };
  },
  mounted() {
    this.renderChart();
  },
  updated() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      this.tabularChart.createChart(
        "#tabular-pairing-chart",
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

<style scoped></style>
