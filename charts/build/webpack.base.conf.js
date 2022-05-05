import path from "path";

import {fileURLToPath} from 'url';

import webpack from "webpack";

const env =
  process.env.NODE_ENV === "production" ? "production" : "development";
const devtool = env === "production" ? "source-map" : "eval-source-map";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default {
  mode: env,
  entry: "./src/index.js",
  output: {
    filename: "pairing-matrix-charts.js",
    library: "PairingMatrixCharts",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  devtool,
  resolve: {
    extensions: [".js"],
    alias: {
      src: path.resolve(__dirname, "../src")
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, "../"),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env": env }),
  ],
  stats: {
    children: false,
    modules: false,
  },
};

