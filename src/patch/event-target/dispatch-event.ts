import {isPointerEventType} from "../../is-pointer-event-type";
import {SUPPORTS_POINTER_EVENT_HANDLERS} from "./global-event-handlers-check";

// Only patch the dispatchEvent EventTarget prototype method if the user agent
// doesn't already support Global Event Handlers for Pointer Events
if (!SUPPORTS_POINTER_EVENT_HANDLERS) {
	// Keep a reference to the original dispatchEvent prototype method
	const originalDispatchEvent = EventTarget.prototype.dispatchEvent;

	/**
	 * Overwrite the dispatchEvent prototype method such that we can provide special handling
	 * for PointerEvents
	 * @param {Event} event
	 * @returns {boolean}
	 */
	EventTarget.prototype.dispatchEvent = function (event: Event): boolean {
		if (isPointerEventType(event.type)) {
			// Also invoke the event handler, if it exists
			const eventHandler: Function|null = this[<keyof EventTarget> `on${event.type}`];
			if (eventHandler != null) {
				eventHandler(event);
			}
		}

		return originalDispatchEvent.call(this, event);
	};
}