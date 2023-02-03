var path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: './index.js',
	output: {
		path: path.resolve(path.join(__dirname, 'build')),
		filename: 'webpack.bundle.js',
	},
	devServer: {
		open: true,
		openPage: '',

		proxy: {},
		publicPath: '/o/react-widget-template/',
	},
	plugins: [new require('copy-webpack-plugin')(['../assets'])],
	module: {
		rules: [{
			test: /src\/.*\.js$/,
			use: {
				loader: "babel-loader",
				options: { configFile: "../.babelrc" },
			},
		}],
	},
	resolve: {
		extensions: ['.js']
	}
};
