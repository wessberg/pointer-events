import {boundHandlerMap} from "../../bound-handler";
import {SUPPORTS_POINTER_EVENTS} from "../window/pointer-event-check";

if (!SUPPORTS_POINTER_EVENTS) {

	// Keep a reference to the original removeEventListener prototype method
	const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

	/**
	 * Overwrite the removeEventListener prototype method such that we can provide special handling
	 * for PointerEvents
	 * @param {string} type
	 * @param {EventListenerOrEventListenerObject | null} listener
	 * @param {EventListenerOptions | boolean} options
	 */
	EventTarget.prototype.removeEventListener = function (type: string, listener?: EventListenerOrEventListenerObject|null, options?: EventListenerOptions|boolean): void {
		if (listener == null) {
			return originalRemoveEventListener.call(this, type, listener, options);
		}

		const boundHandlers = boundHandlerMap.get(listener);
		if (boundHandlers != null) {
			boundHandlers.forEach(handler => originalRemoveEventListener.call(this, type, handler, options));
			boundHandlerMap.delete(listener);
		}

		else {
			originalRemoveEventListener.call(this, type, listener, options);
		}
	};
}