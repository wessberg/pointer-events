import {PointerEvent} from "../../pointer-event";
import {isPointerEventType} from "../../is-pointer-event-type";
import {convertPointerEventType} from "../../convert-pointer-event-type";
import {handlePointerEventForTouch} from "../../touch/touch-handler";
import {handlePointerEventForMouse} from "../../mouse/mouse-handler";
import {invokeListener} from "../../invoke-listener";
import {addBoundHandler} from "../../bound-handler";
import {SUPPORTS_POINTER_EVENTS} from "../window/pointer-event-check";

if (!SUPPORTS_POINTER_EVENTS) {

// Keep a reference to the original addEventListener prototype method
	const originalAddEventListener = EventTarget.prototype.addEventListener;

	/**
	 * Overwrite it such that we can add special handling for PointerEvents
	 * @param {string} type
	 * @param {EventListenerOrEventListenerObject | null} listener
	 * @param {boolean | AddEventListenerOptions} options
	 */
	EventTarget.prototype.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject|null, options?: boolean|AddEventListenerOptions): void {
		if (listener == null) {
			return originalAddEventListener(type, listener, options);
		}

		if (isPointerEventType(type)) {
			const convertedEventType = convertPointerEventType(type);

			const handler = (e: MouseEvent|TouchEvent) => "changedTouches" in e
				? handlePointerEventForTouch(this, type, e, listener)
				: handlePointerEventForMouse(this, type, e, listener);

			const firedPointerEventsHandler = (e: PointerEvent) => {
				// Only call the listener if the PointerEvent is **NOT** trusted
				// This is to ensure that no duplicate events are fired in browsers that natively supports PointerEvents, but where this polyfill is force-applied anyway
				if (!e.isTrusted) {
					invokeListener(e, listener);
				}
			};
			if (convertedEventType != null) {
				originalAddEventListener.call(this, convertedEventType, handler, options);
				// Add the original listener to the bound handler Map mapped to the 'handler' function so that we can
				// remove the listener at a later point
				addBoundHandler(listener, handler);
			}

			// Also add a listener for the pointer event name since these may be fired on the node as well
			originalAddEventListener.call(this, type, firedPointerEventsHandler, options);

			// Add the original listener to the bound handler Map mapped to the 'firedPointerEventsHandler' function so that we can
			// remove the listener at a later point
			addBoundHandler(listener, firedPointerEventsHandler);
		}

		else {
			originalAddEventListener.call(this, type, listener, options);
		}
	};
}