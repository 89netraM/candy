import React, { Component, ReactNode } from "react";
import { Text, Pivot, PivotItem, AnimationClassNames } from "@fluentui/react";

interface AppState {

}

export class App extends Component<{}, AppState> {
	private static readonly defaultState: AppState = { };

	public constructor(props: {}) {
		super(props);

		this.state = { ...App.defaultState };
	}

	public render(): ReactNode {
		return (
			<div>
				<Text variant="mega">Godis</Text>
				<Pivot>
					<PivotItem headerText="Öppna godis" itemKey="open" className={AnimationClassNames.slideRightIn40}>
						<Text variant="large">Öppna godis</Text>
					</PivotItem>
					<PivotItem headerText="Meddelanden" itemKey="noti" className={AnimationClassNames.slideLeftIn40}>
						<Text variant="large">Meddelanden</Text>
					</PivotItem>
				</Pivot>
			</div>
		);
	}
}