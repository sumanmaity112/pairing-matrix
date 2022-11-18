<template>
  <div :class="`alert ${className}`">
    <strong>{{ type }}!</strong> {{ message }}
  </div>
</template>

<script>
export default {
  name: "Alert",
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
  computed: {
    className() {
      if (this.type.toLowerCase() === "error") return "danger";
      return "info";
    },
  },
};
</script>

<style scoped>
.alert {
  padding: 20px;
  width: 50%;
  text-align: center;
  margin: 0 auto;
}

.danger {
  background-color: rgba(244, 67, 54, 0.73);
}

.info {
  background-color: rgba(33, 150, 243, 0.3);
}
</style>
