const webpack = require("webpack");
const path = require("path");
const BabiliPlugin = require("babili-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const config = {
	target: "web",
	entry: __dirname + "/src/index.js",
	output: {
		path: __dirname + "/dist",
		filename: "appbase.js",
		library: "Appbase",
		libraryTarget: "umd",
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.json$/,
				loader: "json-loader"
			},
			{
				test: /(\.js)$/,
				loader: "babel-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		modules: [path.resolve("./node_modules"), path.resolve("./src")],
		extensions: [".json", ".js"]
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, "node-noop"),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				join_vars: true,
				if_return: true
			},
			output: {
				comments: false
			}
		}),
		new BabiliPlugin(),
		new BrotliPlugin({
			asset: "[path].br[query]",
			test: /\.(js|css)$/,
			mode: 0,
			quality: 11
		}),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/
		})
	]
};

module.exports = config;
