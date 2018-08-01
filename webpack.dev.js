const webpack = require('webpack');
const WebpackDashboard = require('webpack-dashboard/plugin');


module.exports = {
  entry: [
    './src/index.jsx',
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js',
    globalObject: 'this',
  },
  module: {
    // apply the following babel rules to files with .js or .jsx extensions
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/react', '@babel/env'],
        plugins: [
          '@babel/transform-arrow-functions',
          '@babel/proposal-object-rest-spread',
          '@babel/transform-template-literals',
        ],
      },
    }],
  },
  // without adding file types to resolve will lead to compile time import erors
  // e.g. import App from './App' -> App.js not found
  resolve: {
    extensions: ['*', '.webpack.js', '.web.js', '.js', '.json', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 3000,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackDashboard(),
  ],
};
