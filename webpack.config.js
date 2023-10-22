const Dotenv = require('dotenv-webpack');
const { ProvidePlugin, EnvironmentPlugin } = require("webpack");
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackNodeExternals = require('webpack-node-externals');

const { NODE_ENV } = process.env;

const CLIENT_CONFIG = {
  mode: NODE_ENV,
  entry: ['@babel/polyfill', './src/browser/client.js'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000,
            },
          },
          'image-webpack-loader',
        ],
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new Dotenv({
      path:
        NODE_ENV === "development"
          ? "./.env.development"
          : "./.env.production",
    }),
    new EnvironmentPlugin({
      ENV_LOCAL: process.env.ENV_LOCAL
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/server/assets',
          to: 'assets',
          noErrorOnMissing: true,
        },
      ],
    }),
    new ProvidePlugin({
      React: "react",
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      DOMPurify: "dompurify"
    })
  ],
  performance: {
    hints: false,
  },
  resolve: {
    modules: ['node_modules']
  }
};

const SERVER_CONFIG = {
  mode: NODE_ENV,
  target: 'node',
  entry: ['@babel/polyfill', './src/server/server.js'],
  externals: [webpackNodeExternals()],
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000,
            },
          },
          'image-webpack-loader',
        ],
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      path:
        NODE_ENV === "development"
          ? ".env.development"
          : ".env.production",
    }),
    new EnvironmentPlugin({
      ENV_LOCAL: process.env.ENV_LOCAL
    }),
    new ProvidePlugin({
      React: "react",
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      DOMPurify: "dompurify"
    })
  ],
  resolve: {
    modules: ['node_modules']
  }
};

module.exports = [CLIENT_CONFIG, SERVER_CONFIG];
