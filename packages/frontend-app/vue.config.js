module.exports = {
  publicPath: "./",
  devServer: {
    port: 8081,
    proxy: {
      "^/api/pair-matrix": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
};
