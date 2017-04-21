var webpack = require('webpack');
var _ = require('lodash');
var config = require('./webpack.config.base');

config = _.merge(config, {
    entry: [
      'webpack-dev-server/client?http://localhost:5656'
    ].concat(config.entry),
    devServer: {
      port: 5656,
      contentBase: 'examples/',
      hot: true,
      inline: true
    },
    plugins: config.plugins.concat([
        new webpack.HotModuleReplacementPlugin()
    ])
});

module.exports = config;
