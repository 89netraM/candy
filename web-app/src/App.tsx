import React, { Component, ReactNode, CSSProperties } from "react";
import { Text, Pivot, PivotItem, AnimationClassNames } from "@fluentui/react";
import { Messages } from "./Messages";
import { Open } from "./Open";

interface AppState {
	pane: string
}

export class App extends Component<{}, AppState> {
	private static readonly defaultState: AppState = {
		pane: "noti"
	};
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
				<Pivot style={App.pivotStyle} selectedKey={this.state.pane} onLinkClick={i => this.navigateTo((i != null ? i.props.itemKey : null) || this.state.pane)}>
					<PivotItem headerText="Öppna godis" itemKey="open" className={AnimationClassNames.slideRightIn40} style={App.itemStyle}>
						<Open onOpen={() => this.navigateTo("noti")}/>
					</PivotItem>
					<PivotItem headerText="Meddelanden" itemKey="noti" className={AnimationClassNames.slideLeftIn40} style={App.itemStyle}>
						<Messages/>
					</PivotItem>
				</Pivot>
			</>
		);
	}

	private navigateTo(key: string): void {
		this.setState({
			pane: key
		});
	}
}