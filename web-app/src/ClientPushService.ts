import registerServiceWorker from "service-worker-loader!./push.worker";

export class ClientPushService {
	private static resolveInstance: (service: ClientPushService) => void;
	private static rejectInstance: (error: Error) => void;
	public static readonly instance: Promise<ClientPushService> = new Promise<ClientPushService>(
		(resolve, reject) => {
			ClientPushService.resolveInstance = resolve;
			ClientPushService.rejectInstance = reject;
		}
	);

	public static async register(): Promise<ClientPushService> {
		try {
			const registration = await registerServiceWorker(
				s => window.location.href.substring(0, window.location.href.lastIndexOf("/")) + s,
				{ scope: "./" }
			);
			await registration.update();

			const instance = new ClientPushService(registration.pushManager);
			ClientPushService.resolveInstance(instance);
			return instance;
		}
		catch (ex) {
			ClientPushService.rejectInstance(ex);
			throw ex;
		}
	}

	// Borrowed from Mozilla: https://github.com/mozilla/serviceworker-cookbook/blob/master/tools.js
	private static urlBase64ToUint8Array(base64String: string): Uint8Array {
		const padding = "=".repeat((4 - base64String.length % 4) % 4);
		const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; i++) {
			outputArray[i] = rawData.charCodeAt(i);
		}

		return outputArray;
	}

	private readonly pushManager: PushManager;

	private constructor(pushManager: PushManager) {
		this.pushManager = pushManager;
	}

	public async subscribe(): Promise<void> {
		await this.acquireNotificationPermissions();
		let subscription = await this.pushManager.getSubscription();

		if (subscription == null) {
			const response = await fetch("./api/publicKey/", { redirect: "follow" });
			const data = await response.json();
			const vapidPublicKey = data.key;
			const convertedKey = ClientPushService.urlBase64ToUint8Array(vapidPublicKey);

			subscription = await this.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: convertedKey
			});
		}

		await fetch(
			"./api/subscribe/",
			{
				method: "POST",
				redirect: "follow",
				body: JSON.stringify({ subscription: subscription.toJSON() })
			}
		);
	}

	private async acquireNotificationPermissions(): Promise<void> {
		if ("Notification" in window) {
			if (Notification.permission === "denied") {
				throw new Error("Du måste godkänna notifikationer först.");
			}
			else if (Notification.permission === "default") {
				await Notification.requestPermission();
				await this.acquireNotificationPermissions();
			}
		}
		else {
			throw new Error("Din webbläsare kan inte skicka notifikationer.");
		}
	}

	public async unsubscribe(): Promise<void> {
		const subscription = await this.pushManager.getSubscription();

		if (subscription != null) {
			await subscription.unsubscribe();

			await fetch(
				"./api/unsubscribe/",
				{
					method: "POST",
					redirect: "follow",
					body: JSON.stringify({ endpoint: subscription.endpoint })
				}
			);
		}
	}

	public async isSubscribed(): Promise<boolean> {
		const subscription = await this.pushManager.getSubscription();
		return subscription != null;
	}
}