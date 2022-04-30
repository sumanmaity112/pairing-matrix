<template>
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
</template>

<script>
import {
  ChordPairingChart,
  TabularPairingChart,
} from "pairing-matrix-vue-visualiser";

export default {
  name: "PairingMatrix",
  components: {
    ChordPairingChart,
    TabularPairingChart,
  },
  data() {
    return {
      pairingMatrix: [],
      authors: [],
      height: 954,
      width: 954,
    };
  },
  computed: {
    displayChordChart() {
      return this.chart === "chord";
    },
  },
  mounted() {
    this.fetchPairingMatrix();
  },
  methods: {
    fetchPairingMatrix() {
      return fetch(
        `./api/pair-matrix?since-days=${this.sinceDays}&pull-data=${this.pullData}&aggregate-by=${this.aggregateBy}`
      )
        .then((res) => res.json())
        .then(({ matrix, authors }) => {
          this.pairingMatrix = matrix;
          this.authors = authors;
        });
    },
  },
  props: {
    sinceDays: {
      type: Number,
      required: true,
    },
    pullData: {
      type: Boolean,
      required: true,
    },
    aggregateBy: {
      type: String,
      required: true,
    },
    chart: {
      type: String,
      required: true,
    },
  },
  watch: {
    sinceDays() {
      this.fetchPairingMatrix();
    },
    pullData() {
      this.fetchPairingMatrix();
    },
    aggregateBy() {
      this.fetchPairingMatrix();
    },
  },
};
</script>

<style scoped></style>
