import {PointerEventType} from "./pointer-event-type";
import {isTouchDevice} from "./is-touch-device";

/**
 * Converts the type of a PointerEvent into one that the browser can understand
 * @param {string} pointerEventType
 * @returns {string|null}
 */
export function convertPointerEventType (pointerEventType: PointerEventType): string|null {
	if (isTouchDevice) {
		switch (pointerEventType) {
			case "pointerdown":
				return "touchstart";
			case "pointermove":
				return "touchmove";
			case "pointerup":
				return "touchend";
			case "pointercancel":
				return "touchcancel";
			case "pointerout":
			case "pointerleave":
			case "pointerenter":
			case "pointerover":
			case "lostpointercapture":
			case "gotpointercapture":
				return null;
		}
	}

	else {
		switch (pointerEventType) {
			case "pointerdown":
				return "mousedown";
			case "pointermove":
				return "mousemove";
			case "pointerup":
				return "mouseup";
			case "pointercancel":
				return null;
			case "pointerout":
				return "mouseout";
			case "pointerleave":
				return "mouseleave";
			case "pointerenter":
				return "mouseenter";
			case "pointerover":
				return "mouseover";
			case "lostpointercapture":
			case "gotpointercapture":
				return null;
		}
	}

	throw new TypeError(`Event of type: '${pointerEventType}' could not be handled!`);
}