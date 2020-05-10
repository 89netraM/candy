declare module "service-worker-loader!*" {
	import { ServiceWorkerRegister, ServiceWorkerNoSupportError, ScriptUrl } from "service-worker-loader/types";

	const register: ServiceWorkerRegister;
	const ServiceWorkerNoSupportError: ServiceWorkerNoSupportError;
	const scriptUrl: ScriptUrl;

	export default register;
	export {
		ServiceWorkerNoSupportError,
		scriptUrl
	};
}