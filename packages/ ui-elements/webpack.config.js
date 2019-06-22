var webpack = require("webpack");
var path = require('path');

module.exports = {
  entry: './elements/bundle.js',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    library: 'main',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  externals: {
    react: 'react',
  }
}
