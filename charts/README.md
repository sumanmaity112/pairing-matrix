# Pairing Matrix charts

[![NPM version](https://img.shields.io/npm/v/pairing-matrix-charts.svg)](https://www.npmjs.com/package/pairing-matrix-charts)

## Installation

Use your favourite package manager:

- [npm](https://npmjs.org): `npm install pairing-matrix-charts`
- [yarn](https://yarnpkg.com/): `yarn add pairing-matrix-charts`

## Usage

```javascript
import { ChordChart, TabularChart } from "pairing-matrix-charts";

const chordChart = new ChordChart();
const tabularChart = new TabularChart();

chordChart.createChart(targetElement, authors, data, width, height);
tabularChart.createChart(targetElement, authors, data, width, height);
```

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
