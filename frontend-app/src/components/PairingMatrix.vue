<template>
  <ChordPairingChart
    :height="height"
    :width="width"
    :data="pairingMatrix"
    :authors="authors"
  />
</template>

<script>
import { ChordPairingChart } from "pairing-matrix-vue-visualiser";

export default {
  name: "PairingMatrix",
  components: {
    ChordPairingChart,
  },
  data() {
    return {
      pairingMatrix: [],
      authors: [],
      height: 954,
      width: 954,
    };
  },
  mounted() {
    this.fetchPairingMatrix().then(({ matrix, authors }) => {
      this.pairingMatrix = matrix;
      this.authors = authors;
    });
  },
  methods: {
    getSince() {
      return (
        new URLSearchParams(window.location.search).get("since-days") || ""
      );
    },
    shouldPullData() {
      return (
        new URLSearchParams(window.location.search).get("pull-data") || false
      );
    },
    fetchPairingMatrix() {
      return fetch(
        `./api/pair-matrix?since-days=${this.getSince()}&pull-data=${this.shouldPullData()}`
      ).then((res) => res.json());
    },
  },
};
</script>

<style scoped></style>
