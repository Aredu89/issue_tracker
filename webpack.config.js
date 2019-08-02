module.exports = {
  entry: './src/App.jsx',
  output: {
    path: './static',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react','es2015']
        }
      }
    ]
  },
  devServer: {
    port: 8000,
    contentBase: 'static',
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      }
    }
  },
  deltool: 'source-map'
}