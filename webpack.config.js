const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app.js'),
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
}