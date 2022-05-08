<template>
  <div :class="`alert ${className}`">
    <strong>{{ type }}!</strong> {{ message }}
  </div>
</template>

<script>
export default {
  name: "Alert",
  computed: {
    className() {
      if ("error" === this.type.toLowerCase()) return "danger";
      return "info";
    },
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "Info",
    },
  },
};
</script>

<style scoped>
.alert {
  padding: 20px;
}

.danger {
  background-color: rgba(244, 67, 54, 0.83);
}

.info {
  background-color: rgba(33, 150, 243, 0.83);
}
</style>
