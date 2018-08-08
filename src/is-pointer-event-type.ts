import {PointerEventType} from "./pointer-event-type";

/**
 * Returns true if the given event type represents a PointerEvent
 * @param {string} type
 * @returns {type is PointerEventType}
 */
export function isPointerEventType (type: string): type is PointerEventType {
	switch (<PointerEventType>type) {
		case "gotpointercapture":
		case "lostpointercapture":
		case "pointerdown":
		case "pointermove":
		case "pointerup":
		case "pointercancel":
		case "pointerenter":
		case "pointerleave":
		case "pointerout":
		case "pointerover":
			return true;
		default:
			return false;
	}
}