import {boundHandlerMap} from "../../bound-handler";
import {SUPPORTS_POINTER_EVENTS} from "../window/pointer-event-check";
import {isPointerEventType} from "../../is-pointer-event-type";
import {convertPointerEventType} from "../../convert-pointer-event-type";

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
	EventTarget.prototype.removeEventListener = function(type: string, listener?: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void {
		const convertedEventType = isPointerEventType(type) ? convertPointerEventType(type) : undefined;

		if (listener == null) {
			originalRemoveEventListener.call(this, type, null, options);
			if (convertedEventType != null) {
				originalRemoveEventListener.call(this, convertedEventType, null, options);
			}
			return;
		}

		const boundHandlers = boundHandlerMap.get(listener);
		if (boundHandlers != null) {
			boundHandlers.forEach(handler => {
				originalRemoveEventListener.call(this, type, handler as EventListener, options);

				if (convertedEventType != null) {
					originalRemoveEventListener.call(this, convertedEventType, handler as EventListener, options);
				}
			});
			boundHandlerMap.delete(listener);
		} else {
			originalRemoveEventListener.call(this, type, listener, options);
			if (convertedEventType != null) {
				originalRemoveEventListener.call(this, convertedEventType, listener, options);
			}
		}
	};
}
