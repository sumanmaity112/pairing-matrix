<template>
  <h2>Pairing Matrix</h2>
  <div>
    <section>
      <h4>Pull new data from github:</h4>
      <input type="radio" v-model="pullData" value="true" />Yes
      <input type="radio" v-model="pullData" value="false" />No
    </section>
    <section>
      <h4>For last days:</h4>
      <input type="number" v-model="sinceDays" />
    </section>
    <section>
      <h4>Aggregate By:</h4>
      <input type="radio" v-model="aggregateBy" value="issue" />Issue
      <input type="radio" v-model="aggregateBy" value="date" />Days
    </section>
    <section>
      <h4>Visualise by:</h4>
      <input type="radio" v-model="chart" value="chord" />Chord Chart
      <input type="radio" v-model="chart" value="tabular" />Tabular Chart
    </section>
  </div>
  <br />
  <PairingMatrix
    :aggregate-by="aggregateBy"
    :pull-data="shouldPullData"
    :since-days="sinceDays"
    :chart="chart"
  ></PairingMatrix>
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

<style scoped></style>
