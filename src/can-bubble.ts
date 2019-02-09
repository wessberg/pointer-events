import {PointerEventType} from "./pointer-event-type";

/**
 * Returns true if the given event type can bubble, based on the given event
 * @param {PointerEventType} type
 * @param {MouseEvent | TouchEvent} e
 * @returns {boolean}
 */
export function canBubble(type: PointerEventType, e: MouseEvent | TouchEvent): boolean {
	switch (type) {
		case "pointerover":
		case "pointerdown":
		case "pointermove":
		case "pointerup":
		case "pointercancel":
		case "pointerout":
		case "gotpointercapture":
		case "lostpointercapture":
			return true;
		default:
			return e.bubbles;
	}
}
