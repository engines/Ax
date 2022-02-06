const resolve = require('path').resolve,
      express = require('express');

module.exports = {
  devServer: {

    // disableHostCheck: true,
    // transportMode: 'ws',
    // injectClient: false,
    // https: false,
    // port: 8080,
    // overlay: true,
    // public: 'http://localhost:8080',

    contentBase: [
      resolve(__dirname, "public"),
      resolve(__dirname, "node_modules")
    ],
    // publicPath:  "/",
    before: function(app) {
      // for parsing application/json
      app.use(express.json())
      // for parsing application/x-www-form-urlencoded
      app.use(express.urlencoded({ extended: true }))
      // POST to /test to get an echo of body params
      app.post('/test', (req, res) => res.json(req.body));
      // app.get('/test', (req, res) => res.status(204).send());
    },
    // serve index.html on 404 (because SPA)
    historyApiFallback: true
  },
  // devtool: 'inline-source-map',
  entry: {
    main: './src/index.js',
    // app: './src/app.js',
    playground: './src/playground.js',
    // 'ax-appkit': './src/ax/appkit.js',
    // 'ax-appkit-twitter-bootstrap4': './src/ax/appkit-twitter-bootstrap4.js'
  },
  // entry: './src/index.js',
  output:{
    publicPath:  "/",
  },
  // output: {
  //   path: path.resolve(__dirname, "output/js"),
  //   filename: 'app.bundle.js',
  //   chunkFilename: '[name].app.bundle.js',
  //   publicPath: '/js/'  <------------------ this was the missing piece.
  // },
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
      // {
      //   test: /html5sortable\/dist\/html5sortable\.js/,
      //   use: [ 'script-loader' ]
      // }
    ],
  },
  // resolve: {
  //   modules: [
  //     'node_modules'
  //   ],
  //   alias: {
  //     'html5sortable': 'html5sortable/dist/html5sortable.cjs'
  //   },
  // }
};
