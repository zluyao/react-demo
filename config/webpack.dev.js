const path = require("path");
var webpack = require('webpack');
const merge = require('webpack-merge');//webpack配置文件合并
const baseConfig = require("./webpack.base.js");//基础配置

let config = {
  mode: 'development',
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
};

module.exports = merge(baseConfig, config);
