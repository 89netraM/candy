import React, { Component } from "react";
import { Text, Stack, Separator, Image, ITextStyles, getTheme, Spinner, SpinnerSize, AnimationClassNames, Toggle, Label, Dialog, DialogType, DialogFooter, DefaultButton } from "@fluentui/react";
import { Card, ICardTokens, ICardStyles, ICardSectionStyles } from "@uifabric/react-cards";
import { Message } from "./Message";
import { ClientPushService } from "./ClientPushService";

interface MessagesState {
	notifications: boolean,
	messages: Array<Message>,
	loading: boolean,
	error?: {
		title: string,
		message: string
	}
}

export class Messages extends Component<{}, MessagesState> {
	private static readonly defaultState: MessagesState = {
		notifications: false,
		messages: [ ],
		loading: true
	};

	private controller: AbortController = new AbortController();

	public constructor(props: {}) {
		super(props);

		this.state = { ...Messages.defaultState };
	}

	public componentDidMount(): void {
		this.updateMessages();
		this.updateNotifications();
	}

	public componentWillUnmount(): void {
		this.controller.abort();
	}

	private async updateMessages(): Promise<void> {
		try {
			const response = await fetch("./api/messages/", { signal: this.controller.signal, redirect: "follow" });
			const data: Array<Message> = await response.json();
			this.setState({
				messages: data.sort((a, b) => b.date - a.date),
				loading: false
			});
		}
		catch (ex) {
			if (!(ex instanceof DOMException && ex.name === "AbortError")) {
				this.setState({
					messages: [],
					error: {
						title: "Kunde inte hämta meddelanden",
						message: ((typeof ex === "object" ? ex.message : ex) || "Men vi vet inte varför 😢")
					},
					loading: false
				});
			}
		}
	}

	private async updateNotifications(): Promise<void> {
		this.setState({
			notifications: await (await ClientPushService.instance).isSubscribed()
		});
	}

	public render(): JSX.Element {
		const theme = getTheme();

		const oneDay = 24 * 60 * 60 * 1000;
		const todayDate = new Date();
		todayDate.setHours(0, 0, 0, 0);
		const yesterdayDate = new Date(todayDate.getTime() - oneDay);
		const thisWeekDate = new Date(todayDate.getTime() - oneDay * todayDate.getDay());
		const lastWeekDate = new Date(thisWeekDate.getTime() - oneDay * 7);

		const todayMessages = this.state.messages.filter(m => todayDate.getTime() <= m.date);
		const yesterdayMessages = this.state.messages.filter(m => yesterdayDate.getTime() <= m.date && m.date < todayDate.getTime());
		const thisWeekMessages = this.state.messages.filter(m => thisWeekDate.getTime() <= m.date && m.date < yesterdayDate.getTime());
		const lastWeekMessages = this.state.messages.filter(m => lastWeekDate.getTime() <= m.date && m.date < thisWeekDate.getTime());
		const earlierMessages = this.state.messages.filter(m => m.date < lastWeekDate.getTime());

		let content = <Spinner size={SpinnerSize.large}/>;
		if (!this.state.loading) {
			content = (
				<>
					{this.renderSection("Idag", todayMessages)}
					{this.renderSection("Igår", yesterdayMessages)}
					{this.renderSection("Denna vecka", thisWeekMessages)}
					{this.renderSection("Förra veckan", lastWeekMessages)}
					{this.renderSection("Tidigare", earlierMessages)}
				</>
			);
		}

		let errorDialog = <></>;
		if (this.state.error != null) {
			const closeModal = () => this.setState({ error: undefined });
			errorDialog = (
				<Dialog
					hidden={false}
					onDismiss={closeModal}
					dialogContentProps={{
						type: DialogType.largeHeader,
						title: this.state.error.title,
						subText: this.state.error.message,
						styles: {
							title: {
								color: theme.semanticColors.errorText
							},
							content: {
								borderTopColor: theme.semanticColors.errorText
							}
						}
					}}>
					<DialogFooter>
						<DefaultButton onClick={closeModal}>OK</DefaultButton>
					</DialogFooter>
				</Dialog>
			);
		}

		return (
			<>
				{errorDialog}
				<Stack horizontal verticalAlign="baseline" horizontalAlign="space-between">
					<Text variant="xLarge" block>Senaste godisöppningarna</Text>
					<Stack horizontal verticalAlign="baseline" tokens={{ childrenGap: "0.5rem" }}>
						<Label htmlFor="push-noti">Push notiser</Label>
						<Toggle id="push-noti" checked={this.state.notifications} onChange={this.onPushChange.bind(this)}/>
					</Stack>
				</Stack>
				<Stack tokens={{ childrenGap: "2rem" }}>{content}</Stack>
			</>
		);
	}

	private renderSection(name: string, messages: Array<Message>): JSX.Element {
		let section = <></>;

		if (messages.length > 0) {
			section = (
				<div>
					<Separator styles={{ root: { marginBottom: "1rem" } }}>{name}</Separator>
					<Stack horizontalAlign="center" tokens={{ childrenGap: "1rem" }}>
						{messages.map(this.renderCard)}
					</Stack>
				</div>
			);
		}

		return section;
	}

	private renderCard(message: Message): JSX.Element {
		const theme = getTheme();
		const tokens: ICardTokens = {
			boxShadow: theme.effects.elevation16,
			boxShadowHovered: theme.effects.elevation64
		};
		const styles: ICardStyles = {
			root: {
				zIndex: 1
			}
		};
		const sectionStyles: ICardSectionStyles = {
			root: {
				padding: theme.spacing.m
			}
		};
		const titleStyles: ITextStyles = {
			root: {
				color: theme.palette.themePrimary
			}
		};
		const date = new Date(message.date);
		const dateText = `${date.toISOString().substring(0, 10)} ${date.getHours()}:${("0" + date.getMinutes()).substr(-2)}`;
		return (
			<Card key={message.date} className={AnimationClassNames.slideUpIn20} horizontal styles={styles} tokens={tokens}>
				<Card.Item>
					{(() => {
						if (message.image != null) {
							return <Image src={message.image}/>;
						}
						else {
							return <Text variant="mega">🍬</Text>;
						}
					})()}
				</Card.Item>
				<Card.Section styles={sectionStyles}>
					<Text variant="medium" block styles={titleStyles}>{message.candyType}</Text>
					<Text variant="smallPlus" block>{message.opener}</Text>
					<Text variant="small" block>{dateText}</Text>
				</Card.Section>
			</Card>
		);
	}

	private async onPushChange(e: any, checked: boolean | undefined): Promise<void> {
		this.setState({
			notifications: checked === true
		});

		try {
			if (checked === true) {
				const pushService = await ClientPushService.instance;
				await pushService.subscribe();
			}
			else if (checked === false) {
				const pushService = await ClientPushService.instance;
				await pushService.unsubscribe();
			}
		}
		catch (ex) {
			this.setState({
				notifications: checked !== true,
				error: {
					title: "Kunde inte aktivera Push notiser",
					message: ex.message
				}
			});
		}
	}
}