const { webpackConfig, webpackMerge, htmlOverlay } = require("just-scripts");

module.exports = webpackMerge(
	webpackConfig,
	htmlOverlay({
		template: "public/index.html"
	}),
	{
		output: {
			publicPath: "./"
		}
	}
);
