<template>
  <Spinner v-if="loading" />
  <Alert v-else-if="displayErrorMessage" :message="errorMessage" type="Error" />
  <Alert
    v-else-if="displayNoDataAvailable"
    :message="`No pairing data is available for last ${sinceDays} day(s)`"
    type="Info"
  />
  <div v-else>
    <div class="container">
      <div class="chart">
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
      <PairRecommendation
        :recommendations="recommendations"
      ></PairRecommendation>
    </div>
  </div>
</template>

<script>
import {
  ChordPairingChart,
  TabularPairingChart,
} from "pairing-matrix-vue-visualiser";
import Spinner from "./Spinner";
import Alert from "./Alert";
import PairRecommendation from "@/components/PairRecommendation";

export default {
  name: "PairingMatrix",
  components: {
    PairRecommendation,
    ChordPairingChart,
    TabularPairingChart,
    Spinner,
    Alert,
  },
  data() {
    return {
      pairingMatrix: [],
      authors: [],
      recommendations: {},
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
    displayNoDataAvailable() {
      return this.authors.length === 0;
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
        .then(({ matrix, authors, recommendations }) => {
          this.loading = false;
          this.pairingMatrix = matrix;
          this.authors = authors;
          this.recommendations = recommendations;
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

<style scoped>
.container {
  display: flex;
}

.chart {
  flex-direction: column;
  width: 77%;
  margin-right: 6%;
}
</style>
