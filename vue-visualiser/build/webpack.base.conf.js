const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader").VueLoaderPlugin;

const env =
  process.env.NODE_ENV === "production" ? "production" : "development";

const devtool = env === "production" ? "source-map" : "eval-source-map";

module.exports = {
  mode: env,
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",
    filename: "[name].js",
  },
  devtool,
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      src: path.resolve(__dirname, "../src"),
      components: path.resolve(__dirname, "../src/components"),
      vue$: path.resolve(__dirname, "../node_modules/vue/dist/vue.cjs.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
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
    new VueLoaderPlugin(),
  ],
  stats: {
    children: false,
    modules: false,
  },
};
