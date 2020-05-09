import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { loadTheme } from "@fluentui/react";
import Worker from "./push.worker.ts";

loadTheme({
	palette: {
		themePrimary: "#bada55",
		themeLighterAlt: "#fcfdf7",
		themeLighter: "#f3f9e1",
		themeLight: "#e9f4c7",
		themeTertiary: "#d4e893",
		themeSecondary: "#c2dd67",
		themeDarkAlt: "#a7c34c",
		themeDark: "#8da540",
		themeDarker: "#68792f",
		neutralLighterAlt: "#faf9f8",
		neutralLighter: "#f3f2f1",
		neutralLight: "#edebe9",
		neutralQuaternaryAlt: "#e1dfdd",
		neutralQuaternary: "#d0d0d0",
		neutralTertiaryAlt: "#c8c6c4",
		neutralTertiary: "#a19f9d",
		neutralSecondary: "#605e5c",
		neutralPrimaryAlt: "#3b3a39",
		neutralPrimary: "#323130",
		neutralDark: "#201f1e",
		black: "#000000",
		white: "#ffffff"
	}
});

const worker = new Worker();

ReactDOM.render(<App/>, document.getElementById("app"));