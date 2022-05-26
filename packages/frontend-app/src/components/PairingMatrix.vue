<template>
  <Spinner v-if="loading" />
  <Alert v-else-if="displayErrorMessage" :message="errorMessage" type="Error" />
  <div v-else>
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
import Spinner from "./Spinner";
import Alert from "./Alert";

export default {
  name: "PairingMatrix",
  components: {
    ChordPairingChart,
    TabularPairingChart,
    Spinner,
    Alert,
  },
  data() {
    return {
      pairingMatrix: [],
      authors: [],
      height: 954,
      width: 954,
      loading: true,
      errorMessage: null,
    };
  },
  computed: {
    displayChordChart() {
      return this.chart === "chord";
    },
    displayErrorMessage() {
      return !!this.errorMessage;
    },
  },
  mounted() {
    this.fetchPairingMatrix();
  },
  methods: {
    fetchPairingMatrix() {
      this.loading = true;
      this.errorMessage = null;
      return fetch(
        `./api/pair-matrix?since-days=${this.sinceDays}&pull-data=${this.pullData}&aggregate-by=${this.aggregateBy}`
      )
        .then((res) => (res.ok ? Promise.resolve(res) : Promise.reject(res)))
        .then((res) => res.json())
        .then(({ matrix, authors }) => {
          this.loading = false;
          this.pairingMatrix = matrix;
          this.authors = authors;
        })
        .catch((res) => {
          this.loading = false;
          this.errorMessage = res.statusText;
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