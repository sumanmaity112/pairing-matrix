# Pairing Matrix charts

[![NPM version](https://img.shields.io/npm/v/pairing-matrix-charts.svg)](https://www.npmjs.com/package/pairing-matrix-charts)

<img src="https://github.com/sumanmaity112/pairing-matrix/blob/main/screenshots/chordChart.png" height="500" alt="chord-chart">
<img src="https://github.com/sumanmaity112/pairing-matrix/blob/main/screenshots/tabularChart.png" height="500" alt="tabular-chart">

## Installation

Use your favourite package manager:

- [npm](https://npmjs.org): `npm install pairing-matrix-charts`
- [yarn](https://yarnpkg.com/): `yarn add pairing-matrix-charts`

## Changelog

Changelog can be found [here](https://github.com/sumanmaity112/pairing-matrix/blob/main/packages/charts/CHANGELOG.md).

## Usage

```javascript
import { ChordChart, TabularChart } from "pairing-matrix-charts";

const chordChart = new ChordChart();
const tabularChart = new TabularChart();

chordChart.createChart(targetElement, authors, data, width, height);
tabularChart.createChart(targetElement, authors, data, width, height);
```

**Note** If your [jest](https://jestjs.io/) tests stops working with `SyntaxError: Cannot use import statement outside a module` error message, you might need to configure `transformIgnorePatterns` for your jest with `/node_modules/(?!(pairing-matrix-charts|d3.*|internmap|delaunator|robust-predicates)/).+\.(js|jsx|mjs|cjs|ts|tsx)$`.

### Usage with VueJs

```vue
<template>
  <div id="tabular-pairing-chart" />
</template>

<script>
import { TabularChart } from "pairing-matrix-charts";

export default {
  name: "TabularPairingChart",
  data() {
    return {
      tabularChart: new TabularChart(),
      height: 954,
      width: 954,
    };
  },
  mounted() {
    this.renderChart();
  },
  updated() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      this.tabularChart.createChart(
        "#tabular-pairing-chart",
        this.authors,
        this.data,
        this.width,
        this.height
      );
    },
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    authors: {
      type: Array,
      required: true,
    },
  },
};
</script>
```

### Usage with ReactJs

```jsx
export default class PairingMatrix extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      tabularChart: new TabularChart(),
      height: 954,
      width: 954,
    };
  }

  componentDidMount() {
    this.renderPairingMatrix();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.renderPairingMatrix();
  }

  renderPairingMatrix() {
    const { authors, matrix } = this.props;
    const { height, width } = this.state;
    this.state.tabularChart.createChart(
      "#tabular-pairing-chart",
      authors,
      matrix,
      width,
      height
    );
  }

  render() {
    return <div id="tabular-pairing-chart" />;
  }
}
```
