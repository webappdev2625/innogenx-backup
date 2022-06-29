const path = require("path");
const zlib = require("zlib");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: ["./Client/js/index.min.js", "./Client/css/index.min.css"],
  },
  output: {
    globalObject: "this",
    path: path.join(__dirname, "public"),
    filename: "./js/[name].min.js",
    chunkFilename: "./js/chunkFilename.[name].min.js",
    // publicPath: "/js/",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: [
          /node_modules/,
          /node_modules[\\\/]core-js/,
          /node_modules[\\\/]webpack[\\\/]buildin/,
          // path.resolve(__dirname, "Client/pages/indexPage/lozad.min.js"),
        ],
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            configFile: "./Client/.babelrc",
            cacheCompression: false,
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"],
          },
        },
      },
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: "html-loader",
      //       options: {
      //         minimize: true,
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: "auto",
              publicPath: "/css/",
            },
          },
          "css-loader",
        ],
        // test: /\.(sa|sc|c)ss$/,
        // use: [
        //   devMode ? "style-loader" : MiniCssExtractPlugin.loader,
        //   "css-loader",
        //   "postcss-loader",
        //   "sass-loader",
        // ],
      },
      {
        test: /\.(webp|png|svg|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "/images/",
              // publicPath: path.resolve(__dirname, "./public/images"),
              outputPath: "./images", // folder name
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts", // folder name
            },
          },
        ],
      },
      // {
      //   test: /\.js$/,
      //   enforce: "pre",
      //   use: [
      //     {
      //       loader: "source-map-loader",
      //       options: {
      //         filterSourceMappingUrl: (url, resourcePath) => {
      //           if (/broker-source-map-url\.js$/i.test(url)) {
      //             return false;
      //           }

      //           if (/keep-source-mapping-url\.js$/i.test(resourcePath)) {
      //             return "skip";
      //           }

      //           return true;
      //         },
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.(jpe?g|png|webp)$/i,
      //   use: [
      //     {
      //       loader: "responsive-loader",
      //       options: {
      //         adapter: require("responsive-loader/sharp"),
      //         format: "webp",
      //         sizes: [320, 640, 960, 1280, 1600, 1900, 2400],
      //         // placeholder: true,
      //         // placeholderSize: 20,
      //         // esModule: true,
      //         // cacheDirectory: true,
      //         publicPath: "/images/test/input",
      //         outputPath: "/images/test/output",
      //         name: "[name]-[width].[ext]",
      //       },
      //     },
      //   ],
      //   type: "javascript/auto",
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "[name].html",
      // template: "html/[name].html",
      template: "./Client/html/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: "auto",
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[name].min.css", // prepend folder name
      chunkFilename: "./css/[name].[id].min.css", // prepend folder name
      ignoreOrder: false,
    }),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 1024,
      minRatio: 0.7,
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 1024,
      minRatio: 0.7,
    }),
    new webpack.ProgressPlugin(),
    // new CleanWebpackPlugin({
    //   cleanAfterEveryBuildPatterns: ["public/js", "!images/**"],
    // }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin({
        // test: /\.foo\.css$/i,
        parallel: true,
      }),
    ],
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".json", ".jsx", ".css"],
  },
  ignoreWarnings: [/Failed to parse source map/],
};
