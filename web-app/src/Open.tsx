import React, { Component } from "react";
import { getTheme, Text, TextField, Stack, PrimaryButton } from "@fluentui/react";

interface OpenState {
	candyType: string,
	name: string,
	valid: boolean
}

export class Open extends Component<{}, OpenState> {
	private static readonly defaultState: OpenState = {
		candyType: "",
		name: "",
		valid: false
	};

	public constructor(props: {}) {
		super(props);

		this.state = { ...Open.defaultState };
	}

	public render(): JSX.Element {
		const theme = getTheme();

		return (
			<>
				<Text variant="xLarge" block>Öppna nytt godis</Text>
				<Text variant="small" block>Anmäl att du öppnat ett nytt godis</Text>

				<Stack tokens={{ childrenGap: "0.5rem" }}>
					<TextField label="Godis sort:"
						defaultValue={this.state.candyType}
						onChange={this.onCandyTypeChange.bind(this)}
						required
						onGetErrorMessage={this.getErrorMessage.bind(this)}
						validateOnLoad={false}
						validateOnFocusOut={true} />
					<TextField label="Ditt namn:"
						defaultValue={this.state.name}
						onChange={this.onNameChange.bind(this)}
						required
						onGetErrorMessage={this.getErrorMessage.bind(this)}
						validateOnLoad={false}
						validateOnFocusOut={true} />
					<Stack.Item align="end">
						<PrimaryButton onClick={this.onReport.bind(this)} disabled={!this.state.valid}>Anmäl</PrimaryButton>
					</Stack.Item>
				</Stack>
			</>
		);
	}

	private onCandyTypeChange(e: any, newValue?: string): void {
		this.setState({
			candyType: newValue || "",
			valid: this.state.name.length >= 3 && (newValue || "").length >= 3
		});
	}

	private onNameChange(e: any, newValue?: string): void {
		this.setState({
			name: newValue || "",
			valid: this.state.candyType.length >= 3 && (newValue || "").length >= 3
		});
	}

	private getErrorMessage(value: string): string {
		return value.length < 3 ? "Skriv minst tre tecken" : "";
	}

	private onReport(): void {
		// TODO: Send to backend
		console.log(this.state);
	}
}