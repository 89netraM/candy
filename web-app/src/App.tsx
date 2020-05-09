import React, { Component, ReactNode, CSSProperties } from "react";
import { Text, Pivot, PivotItem, AnimationClassNames } from "@fluentui/react";
import { Messages } from "./Messages";

interface AppState {

}

export class App extends Component<{}, AppState> {
	private static readonly defaultState: AppState = { };
	private static readonly pivotStyle: CSSProperties = {
		overflowX: "hidden"
	};
	private static readonly itemStyle: CSSProperties = {
		padding: "1rem"
	};

	public constructor(props: {}) {
		super(props);

		this.state = { ...App.defaultState };
	}

	public render(): ReactNode {
		return (
			<>
				<Text variant="mega" block>Godis</Text>
				<Pivot style={App.pivotStyle} defaultSelectedKey="noti">
					<PivotItem headerText="Öppna godis" itemKey="open" className={AnimationClassNames.slideRightIn40} style={App.itemStyle}>
						<Text variant="large">Öppna godis</Text>
					</PivotItem>
					<PivotItem headerText="Meddelanden" itemKey="noti" className={AnimationClassNames.slideLeftIn40} style={App.itemStyle}>
						<Messages/>
					</PivotItem>
				</Pivot>
			</>
		);
	}
}