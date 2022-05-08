<template>
  <div id="spinner" />
</template>

<script>
export default {
  name: "Spinner",
  components: {},
};
</script>

<style scoped>
#spinner {
  z-index: 1;
  width: 120px;
  height: 120px;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  margin: 0 auto;
  border-top: 16px solid #d2691e;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
