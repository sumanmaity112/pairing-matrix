<template>
  <div class="pair-recommendations-container">
    <h4>
      Pair Recommendations for
      <select id="author" name="author" @change="onAuthorSelect($event)">
        <option
          v-for="author in authors"
          :key="'author-' + author"
          :value="author"
          :selected="author === selectedAuthor"
        >
          {{ author }}
        </option>
      </select>
    </h4>
    <table>
      <thead>
        <tr>
          <th>Order</th>
          <th>Name</th>
        </tr>
      </thead>
      <tr
        v-for="(coAuthor, index) in recommendedCoauthors"
        :key="'coAuthor-' + coAuthor + '-' + index"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ coAuthor }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "PairRecommendation",
  props: {
    recommendations: {
      type: Object,
      required: true,
    },
  },
  data() {
    const authors = Object.keys(this.recommendations).sort();
    return {
      authors,
      selectedAuthor: authors[0],
    };
  },
  computed: {
    recommendedCoauthors() {
      return this.recommendations[this.selectedAuthor];
    },
  },
  methods: {
    onAuthorSelect(e) {
      this.selectedAuthor = e.target.value;
    },
  },
};
</script>

<style scoped>
th,
td {
  width: 153px;
}

td {
  padding-left: 10px;
  line-height: 23px;
}

table {
  border: 1px solid sandybrown;
  border-radius: 5px;
}

tr:nth-child(odd) {
  background-color: bisque;
}

th {
  text-align: center;
  background-color: sandybrown;
  line-height: 28px;
}

#author {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom: 1px solid black;
  font-size: 18px;
  font-weight: bold;
}
</style>
