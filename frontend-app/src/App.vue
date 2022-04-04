<template>
  <div id="container">
    <PairingMatrix />
  </div>
</template>

<script>
import PairingMatrix from "@/components/PairingMatrix";

export default {
  name: "App",
  components: {
    PairingMatrix,
  },
};
</script>

<style>
#container {
  width: 55%;
}
</style>
