const { webpackMerge, htmlOverlay, webpackServeConfig } = require("just-scripts");
module.exports = webpackMerge(
	webpackServeConfig,
	htmlOverlay({
		template: "public/index.html"
	}),
	{
		output: {
			publicPath: "/"
		}
	}
);
