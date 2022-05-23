const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");

module.exports = merge(baseWebpackConfig, {
  watch: true,
  entry: "./src/index.js",
  output: {
    filename: "pairing-matrix-vue-visualiser.js",
    library: "PairingMatrixVueVisualiser",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
});
