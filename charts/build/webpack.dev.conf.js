import {merge} from "webpack-merge";

import baseWebpackConfig from "./webpack.base.conf.js";

export default merge(baseWebpackConfig, {
  watch: true,
});
