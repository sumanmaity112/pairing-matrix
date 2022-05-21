<template>
  <div class="pairing-matrix-page">
    <h2 class="pairing-matrix-title">Pairing Matrix</h2>
    <div class="pairing-matrix-container">
      <div class="pairing-matrix-config-container">
        <section class="pairing-matrix-config">
          <h4>Pull new data from github:</h4>
          <input type="radio" v-model="pullData" value="true" />Yes
          <input type="radio" v-model="pullData" value="false" />No
        </section>
        <section class="pairing-matrix-config">
          <h4>For last days:</h4>
          <input type="number" v-model="sinceDays" />
        </section>
        <section class="pairing-matrix-config">
          <h4>Aggregate By:</h4>
          <input type="radio" v-model="aggregateBy" value="issue" />Issue
          <input type="radio" v-model="aggregateBy" value="days" />Days
        </section>
        <section class="pairing-matrix-config">
          <h4>Visualise by:</h4>
          <input type="radio" v-model="chart" value="chord" />Chord Chart
          <input type="radio" v-model="chart" value="tabular" />Tabular Chart
        </section>
      </div>
      <div class="pairing-matrix">
        <PairingMatrix
          :aggregate-by="aggregateBy"
          :pull-data="shouldPullData"
          :since-days="sinceDays"
          :chart="chart"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PairingMatrix from "@/components/PairingMatrix";

export default {
  name: "PairingMatrixPage",
  components: { PairingMatrix },
  data() {
    return {
      pullData: false,
      sinceDays: 14,
      aggregateBy: "issue",
      chart: "chord",
    };
  },
  computed: {
    shouldPullData() {
      return this.pullData === "true";
    },
  },
};
</script>

<style scoped>
.pairing-matrix-page {
  width: 80%;
  margin: 0 auto;
}

.pairing-matrix-title {
  text-align: center;
}

.pairing-matrix-container {
  display: flex;
}

.pairing-matrix-config-container {
  display: flex;
  flex-direction: column;
  width: 35%;
}

.pairing-matrix-config {
  margin-left: 20px;
  margin-right: 20px;
}

.pairing-matrix {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 65%;
  margin: 0 auto;
}
</style>
