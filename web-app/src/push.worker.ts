// @ts-nocheck
import { Message } from "./Message";

const ctx = self as unknown as ServiceWorkerGlobalScope;

ctx.addEventListener(
	"push",
	e => {
		if (e.data != null) {
			const message: Message = e.data.json();
			const notiOptions: NotificationOptions = {
				body: `${message.opener} öppnade ${message.candyType}`,
				timestamp: message.date,
				image: message.image,
				tag: message.opener + message.date
			};
			
			const notiPromise = ctx.registration.showNotification("Godis!", notiOptions);
			e.waitUntil(notiPromise);
		}
	},
	false
);

const handleNoti = async () => {
	const clientList = await ctx.clients.matchAll({ type: "window" });

	if (clientList.length > 0) {
		for (const client of clientList) {
			if (client.frameType === "top-level" && client instanceof WindowClient) {
				client.focus();
				return;
			}
		}
	}

	ctx.clients.openWindow("/candy");
};

ctx.addEventListener(
	"notificationclick",
	e => {
		e.notification.close();
		e.waitUntil(handleNoti());
	},
	false
);