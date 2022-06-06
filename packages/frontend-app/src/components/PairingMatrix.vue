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
      <PairingMatrixChart
        :height="height"
        :width="width"
        :pairingMatrix="pairingMatrix"
        :authors="authors"
        :chart="chart"
      />
      <PairRecommendation :recommendations="recommendations" />
    </div>
  </div>
</template>

<script>
import Spinner from "./Spinner";
import Alert from "./Alert";
import PairRecommendation from "@/components/PairRecommendation";
import PairingMatrixChart from "@/components/PairingMatrixChart";

export default {
  name: "PairingMatrix",
  components: {
    PairingMatrixChart,
    PairRecommendation,
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
</style>
