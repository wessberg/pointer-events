import {PointerEventType} from "./pointer-event-type";

/**
 * Returns true if the given event type is cancelable, based on the given event
 * @param {PointerEventType} type
 * @param {MouseEvent | TouchEvent} e
 * @returns {boolean}
 */
export function isCancelable (type: PointerEventType, e: MouseEvent|TouchEvent): boolean {
	switch (type) {
		case "pointerover":
		case "pointerdown":
		case "pointermove":
		case "pointerup":
			return true;
		default:
			return e.cancelable;
	}
}