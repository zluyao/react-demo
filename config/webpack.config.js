const merge = require('webpack-merge');//webpack配置文件合并
var webpack = require('webpack');
const baseConfig = require("./webpack.base.js");//基础配置

let config = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ],
};

module.exports = merge(baseConfig, config);
