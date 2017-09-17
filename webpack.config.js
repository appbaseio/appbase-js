const webpack = require("webpack");
const path = require("path");

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
		new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, "node-noop")
	]
};

module.exports = config;