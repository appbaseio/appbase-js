const webpack = require("webpack");
const path = require("path");

const config = {
	entry: __dirname + "/src/index.js",
	devtool: "source-map",
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
				test: /(\.jsx|\.js)$/,
				loader: "babel-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		modules: [path.resolve("./node_modules"), path.resolve("./src")],
		extensions: [".json", ".js"]
	}
};

if (process.env.NODE_ENV === "production") {
	config.plugins = [
		new webpack.optimize.UglifyJsPlugin({ minimize: true })
	]
}

module.exports = config;