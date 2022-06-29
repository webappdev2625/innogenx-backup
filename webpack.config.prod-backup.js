const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    // index: "./Client/index.js",
    index: path.resolve(__dirname, "Client/index.js"),
  },
  output: {
    filename: "[name].[contenthash].min.js",
    path: path.resolve(__dirname, "public"),
    // path: path.join(__dirname, "public"),
    // filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          configFile: "./Client/.babelrc",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./Client/pages/indexPage/index.html",
      filename: "./index.html",
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ["public"],
    }),
  ],
  optimization: {},
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".json", ".jsx", ".css"],
  },
};
