const path = require('path')

const config = {
  entry: './src/Main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /(\.css)$/, 
        loaders: ['style-loader', 'css-loader']
      }

    ]
  }
}

module.exports = config