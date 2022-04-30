<template>
  <div id="container">
    <PairingMatrixPage />
  </div>
</template>

<script>
import PairingMatrixPage from "@/components/PairingMatrixPage";

export default {
  name: "App",
  components: {
    PairingMatrixPage,
  },
};
</script>

<style>
#container {
  width: 55%;
}
</style>
