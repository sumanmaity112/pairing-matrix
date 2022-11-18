<template>
  <div class="pairing-matrix-page">
    <h2 class="pairing-matrix-title">Pairing Matrix</h2>
    <div class="pairing-matrix-container">
      <div class="pairing-matrix-config-container">
        <section class="pairing-matrix-config">
          <h4>Pull new data from github:</h4>
          <input
            v-model="pullData"
            type="radio"
            value="true"
            data-testid="pairing-matrix-pull-data-config-yes"
          />Yes
          <input
            v-model="pullData"
            type="radio"
            value="false"
            data-testid="pairing-matrix-pull-data-config-no"
          />No
        </section>
        <section id="pairing-matrix-days-config" class="pairing-matrix-config">
          <h4>For last days:</h4>
          <input v-model="sinceDays" type="number" />
        </section>
        <section
          id="pairing-matrix-aggregation-config"
          class="pairing-matrix-config"
        >
          <h4>Aggregate By:</h4>
          <input v-model="aggregateBy" type="radio" value="issue" />Issue
          <input v-model="aggregateBy" type="radio" value="days" />Days
        </section>
        <section id="pairing-matrix-chart-config" class="pairing-matrix-config">
          <h4>Visualise by:</h4>
          <input v-model="chart" type="radio" value="chord" />Chord Chart
          <input v-model="chart" type="radio" value="tabular" />Tabular Chart
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
      // TODO: Change pullData to String
      pullData: true,
      sinceDays: 14,
      aggregateBy: "days",
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
  width: 93%;
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
  width: 20%;
}

.pairing-matrix-config {
  margin-left: 20px;
  margin-right: 20px;
}

.pairing-matrix {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
}
</style>
