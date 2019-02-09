import {POINTER_ID_TO_CAPTURED_TARGET_MAP} from "../../pointer-capture";
import {SUPPORTS_POINTER_EVENTS} from "../window/pointer-event-check";

// tslint:disable:no-any

if (!SUPPORTS_POINTER_EVENTS) {
	/**
	 * Checks if the element has pointer capture for the pointer identified by the argument pointerId
	 * https://www.w3.org/TR/pointerevents/#extensions-to-the-element-interface
	 * @param {number} pointerId
	 */
	(<any>Element).prototype.hasPointerCapture = function(pointerId: number): boolean {
		return POINTER_ID_TO_CAPTURED_TARGET_MAP.get(pointerId) != null;
	};
}
