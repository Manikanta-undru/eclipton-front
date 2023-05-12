const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    static: {
      directory: path.join(__dirname, '/'),
    },
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  devtool: "eval-cheap-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)(\?.*$|$)/i,
        type: 'asset/resource',
      },
      {
        test: /\.(mp4|webm|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'videos/',
              publicPath: 'videos/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin(),
    new Dotenv(),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      fix: true,
      failOnError: true,
    }),
    new PrettierPlugin(),
  ],
};
