const { webpackConfig, webpackMerge, htmlOverlay } = require("just-scripts");

module.exports = webpackMerge(
	webpackConfig,
	htmlOverlay({
		template: "public/index.html"
	}),
	{
		module: {
			rules: [
				{
					test: /worker\.[tj]s$/,
					use: [
						"worker-loader"
					]
				},
				{
					test: /worker\.ts$/,
					use: [
						"ts-loader"
					]
				}
			]
		},
		output: {
			publicPath: "./"
		}
	}
);
