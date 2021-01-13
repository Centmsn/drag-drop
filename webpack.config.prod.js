const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    main: "./src/app.ts",
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    open: true,
  },

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [new CleanWebpackPlugin()],

  resolve: {
    extensions: [".ts", ".js"],
  },
};
