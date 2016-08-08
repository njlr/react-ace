'use strict';

var webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        } 
      }
    ]
  },
  output: {
    library: 'ReactAce',
    libraryTarget: 'umd'
  }
};
