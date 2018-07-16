const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    port: 8001
  },
  module: {
    loaders: [
      {
        test: /\.js$/, loader: 'babel-loader',
        query: {
          plugins: [
            'transform-class-properties',
            'transform-es3-member-expression-literals',
            'transform-es3-property-literals'
          ]
        }
      },
      {
        test: /\.jsx$/, loader: 'babel-loader',
        query: {
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css?$/, loader: "style-loader!css-loader"
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        loader: 'url-loader'
      },
      {
        test: /.(jpg|png)$/,
        loader: 'url-loader',
        options: { limit: 25000, },
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: true,
    //   compress: {
    //     warnings: false, // Suppress uglification warnings
    //     pure_getters: true,
    //     unsafe: true,
    //     unsafe_comps: true,
    //     screw_ie8: true
    //   },
    //   output: {
    //     comments: false,
    //   },
    //   exclude: [/\.min\.js$/gi] // skip pre-minified libs
    // }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
  ]
}