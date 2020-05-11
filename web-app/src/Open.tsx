import React, { Component } from "react";
import { getTheme, Text, TextField, Stack, PrimaryButton, Dialog, DialogType, DialogFooter, DefaultButton } from "@fluentui/react";

interface OpenProps {
	onOpen?: () => void
}
interface OpenState {
	candyType: string,
	name: string,
	valid: boolean,
	opened: boolean
}

export class Open extends Component<OpenProps, OpenState> {
	private static readonly defaultState: OpenState = {
		candyType: "",
		name: "",
		valid: false,
		opened: false
	};

	public constructor(props: OpenProps) {
		super(props);

		this.state = { ...Open.defaultState };
	}

	public render(): JSX.Element {
		const theme = getTheme();
		
		let dialog = <></>;
		if (this.state.opened) {
			const onDismiss = () => this.props.onOpen != null ? this.props.onOpen() : null;
			dialog = (
				<Dialog
					hidden={false}
					onDismiss={this.onDialogDismiss.bind(this)}
					dialogContentProps={{
						type: DialogType.largeHeader,
						title: "Skickat!",
						subText: "Njut av godiset tillsammans",
						styles: {
							title: {
								color: theme.semanticColors.successText
							},
							content: {
								borderTopColor: theme.semanticColors.successText
							}
						}
					}}>
					<DialogFooter>
						<DefaultButton onClick={onDismiss}>OK</DefaultButton>
					</DialogFooter>
				</Dialog>
			);
		}

		return (
			<>
				{dialog}
				<Text variant="xLarge" block>Öppna nytt godis</Text>
				<Text variant="small" block>Anmäl att du öppnat ett nytt godis</Text>

				<Stack tokens={{ childrenGap: "0.5rem" }}>
					<TextField label="Godis sort:"
						value={this.state.candyType}
						onChange={this.onCandyTypeChange.bind(this)}
						required
						onGetErrorMessage={this.getErrorMessage.bind(this)}
						validateOnLoad={false}
						validateOnFocusOut={true} />
					<TextField label="Ditt namn:"
						value={this.state.name}
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

	private async onReport(): Promise<void> {
		fetch(
			"./api/open/",
			{
				method: "POST",
				redirect: "follow",
				body: JSON.stringify({
					message: {
						candyType: this.state.candyType,
						opener: this.state.name
					}
				})
			}
		);

		this.setState({ opened: true });
	}

	private onDialogDismiss(): void {
		this.setState({
			opened: false,
			candyType: "",
			name: ""
		});
	}
}