const resolve = require('path').resolve,
      express = require('express');

module.exports = {
  devServer: {
    contentBase: [
      resolve(__dirname, "public"),
      resolve(__dirname, "node_modules")
    ],
    before: function(app) {
      // for parsing application/json
      app.use(express.json())
      // for parsing application/x-www-form-urlencoded
      app.use(express.urlencoded({ extended: true }))
      // POST to /test to get an echo of body params
      app.post('/test', (req, res) => res.json(req.body));
    },
    // serve index.html on 404 (because SPA)
    historyApiFallback: true
  },
  entry: {
    main: './src/index.js',
    playground: './src/playground.js',
  },
  output:{
    publicPath:  "/",
  },
  optimization: {
    splitChunks: { chunks: "all" }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.md$/,
        use: {
          loader: 'raw-loader'
        },
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
    ],
  },
};
