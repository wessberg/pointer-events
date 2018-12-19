import {PointerEvent} from "./pointer-event";

/**
 * Invokes a listener with the given event
 * @param {PointerEvent} event
 * @param {EventListenerOrEventListenerObject} listener
 */
export function invokeListener (event: PointerEvent, listener: EventListenerOrEventListenerObject): void {
	typeof listener === "function"
		? listener(event as Event)
		: listener.handleEvent(event);
}