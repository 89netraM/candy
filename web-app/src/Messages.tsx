import React, { Component } from "react";
import { Text, Stack, Separator, Image, ITextStyles, getTheme, Spinner, SpinnerSize, AnimationClassNames } from "@fluentui/react";
import { Card, ICardTokens, ICardStyles, ICardSectionStyles } from "@uifabric/react-cards";
import { Message } from "./Message";

interface MessagesState {
	messages: Array<Message>,
	loading: boolean
}

export class Messages extends Component<{}, MessagesState> {
	private static readonly defaultState: MessagesState = {
		messages: [ ],
		loading: true
	};

	private loadingTimeout: number = -1;

	public constructor(props: {}) {
		super(props);

		this.state = { ...Messages.defaultState };
	}

	public componentDidMount(): void {
		// TODO: Load real messages!
		this.loadingTimeout = window.setTimeout(() =>
			this.setState({
				messages: [
					{
						candyType: "Geléhallon1",
						date: new Date(2020, 4, 9, 10, 0),
						opener: "Mårten"
					},
					{
						candyType: "Geléhallon2",
						date: new Date(2020, 4, 8, 10, 0),
						opener: "Mårten"
					},
					{
						candyType: "Geléhallon3",
						date: new Date(2020, 4, 6, 10, 0),
						opener: "Mårten"
					},
					{
						candyType: "Geléhallon4",
						date: new Date(2020, 4, 5, 10, 0),
						opener: "Mårten"
					},
					{
						candyType: "Geléhallon5",
						date: new Date(2020, 4, 1, 10, 0),
						opener: "Mårten"
					},
					{
						candyType: "Geléhallon6",
						date: new Date(2020, 3, 30, 10, 0),
						opener: "Mårten"
					},
					{
						candyType: "Geléhallon7",
						date: new Date(2020, 3, 10, 10, 0),
						opener: "Mårten"
					},
					{
						candyType: "Geléhallon8",
						date: new Date(2020, 3, 1, 10, 0),
						opener: "Mårten"
					}
				],
				loading: false
			}),
			2500
		);
	}

	public componentWillUnmount(): void {
		window.clearTimeout(this.loadingTimeout);
	}

	public render(): JSX.Element {
		const oneDay = 24 * 60 * 60 * 1000;
		const todayDate = new Date();
		todayDate.setHours(0, 0, 0, 0);
		const yesterdayDate = new Date(todayDate.getTime() - oneDay);
		const thisWeekDate = new Date(todayDate.getTime() - oneDay * todayDate.getDay());
		const lastWeekDate = new Date(thisWeekDate.getTime() - oneDay * 7);

		const todayMessages = this.state.messages.filter(m => todayDate.getTime() <= m.date.getTime());
		const yesterdayMessages = this.state.messages.filter(m => yesterdayDate.getTime() <= m.date.getTime() && m.date.getTime() < todayDate.getTime());
		const thisWeekMessages = this.state.messages.filter(m => thisWeekDate.getTime() <= m.date.getTime() && m.date.getTime() < yesterdayDate.getTime());
		const lastWeekMessages = this.state.messages.filter(m => lastWeekDate.getTime() <= m.date.getTime() && m.date.getTime() < thisWeekDate.getTime());
		const earlierMessages = this.state.messages.filter(m => m.date.getTime() < lastWeekDate.getTime());

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

		return (
			<>
				<Text variant="xLarge">Senaste godisöppningarna</Text>
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
		const dateText = `${message.date.toISOString().substring(0, 10)} ${message.date.getHours()}:${("0" + message.date.getMinutes()).substr(-2)}`;
		return (
			<Card key={message.date.toISOString()} className={AnimationClassNames.slideUpIn20} horizontal styles={styles} tokens={tokens}>
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
					<Text variant="medium" styles={titleStyles}>{message.candyType}</Text>
					<Text variant="smallPlus">{message.opener}</Text>
					<Text variant="small">{dateText}</Text>
				</Card.Section>
			</Card>
		);
	}
}