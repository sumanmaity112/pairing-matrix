<template>
  <div class="pairing-matrix-chart">
    <ChordPairingChart
      :height="height"
      :width="width"
      :data="pairingMatrix"
      :authors="authors"
      v-if="displayChordChart"
    />
    <TabularPairingChart
      :height="height"
      :width="width"
      :data="pairingMatrix"
      :authors="authors"
      v-else
    />
  </div>
</template>

<script>
import {
  ChordPairingChart,
  TabularPairingChart,
} from "pairing-matrix-vue-visualiser";

export default {
  name: "PairingMatrixChart",
  components: {
    ChordPairingChart,
    TabularPairingChart,
  },
  computed: {
    displayChordChart() {
      return this.chart === "chord";
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
    pairingMatrix: {
      type: Object,
      required: true,
    },
    authors: {
      type: Array,
      required: true,
    },
    chart: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.pairing-matrix-chart {
  flex-direction: column;
  width: 77%;
  margin-right: 6%;
}
</style>
