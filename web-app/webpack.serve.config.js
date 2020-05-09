const { webpackMerge, htmlOverlay, webpackServeConfig } = require("just-scripts");
module.exports = webpackMerge(
	webpackServeConfig,
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
			publicPath: "/"
		}
	}
);
