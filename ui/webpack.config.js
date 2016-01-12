module.exports = {
	entry: {
		javascript: "./src/app.js",
		html: "./src/index.html"
	},
	output: {
		path: './build',
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel', // 'babel-loader' is also a legal name to reference
				query: {
					presets: ['react', 'es2015']
				}
			},
			{
				test: /\.html$/,
				loader: "file?name=[name].[ext]",
			}
		]
	}
};
