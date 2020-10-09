const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './v4entry.js'),
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // fallback: { "crypto": "crypto-browserify" }
    fallback: { "crypto": false }
  }
};