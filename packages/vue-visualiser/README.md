# Pairing Matrix visualiser (Vue)

[![NPM version](https://img.shields.io/npm/v/pairing-matrix-vue-visualiser.svg)](https://www.npmjs.com/package/pairing-matrix-vue-visualiser)
This package contains charts to visualise pairing matrix. This package can be used to easily create visualization using
data created by [pairing-matrix-engine](https://www.npmjs.com/package/pairing-matrix-engine) package.

<img src="https://github.com/sumanmaity112/pairing-matrix/blob/main/screenshots/chordChart.png" height="500" alt="chord-chart">
<img src="https://github.com/sumanmaity112/pairing-matrix/blob/main/screenshots/tabularChart.png" height="500" alt="tabular-chart">

## Installation

Use your favourite package manager:

- [npm](https://npmjs.org): `npm install pairing-matrix-vue-visualiser`
- [yarn](https://yarnpkg.com/): `yarn add pairing-matrix-vue-visualiser`

## Usage

Include into your JavaScript app as an ES Module:

```vue
<template>
  <ChordPairingChart
    :height="height"
    :width="width"
    :data="pairingMatrix"
    :authors="authors"
  />
</template>

<script>
import { ChordPairingChart } from "pairing-matrix-vue-visualiser";

export default {
  name: "PairingMatrix",
  components: {
    ChordPairingChart,
  },
  data() {
    return {
      pairingMatrix: [],
      authors: [],
      height: 954,
      width: 954,
    };
  },
};
</script>
```
