import {POINTER_ID_TO_CAPTURED_TARGET_MAP} from "../../pointer-capture";
import {isTouchDevice} from "../../is-touch-device";
import {createPointerEventsForTouchOfTypeAndDispatch} from "../../touch/touch-handler";
import {createPointerEventsForMouseOfTypeAndDispatch} from "../../mouse/mouse-handler";
import {SUPPORTS_POINTER_EVENTS} from "../window/pointer-event-check";
import {SEEN_POINTER_IDS} from "../../seen-pointer-ids";
import {throwDOMException} from "../../throw-dom-exception";

if (!SUPPORTS_POINTER_EVENTS) {
	/**
	 * Releases pointer capture for the pointer identified by the argument pointerId to the element on which
	 * this method is invoked
	 * https://www.w3.org/TR/pointerevents/#extensions-to-the-element-interface
	 * @param {number} pointerId
	 */
	Element.prototype.releasePointerCapture = function(pointerId: number): void {
		// If no active pointer exists with the given pointer id, throw a DOMException
		// with name 'InvalidPointerId'
		// https://www.w3.org/TR/pointerevents/#setting-pointer-capture
		if (!SEEN_POINTER_IDS.has(pointerId)) {
			throwDOMException(`Could not release pointer capture on an element: No active pointers exist with the given pointer id: '${pointerId}'`, "InvalidPointerId");
		}

		// Otherwise, mark the pointer id as captured by this element
		POINTER_ID_TO_CAPTURED_TARGET_MAP.delete(pointerId);

		isTouchDevice
			? createPointerEventsForTouchOfTypeAndDispatch("lostpointercapture", new TouchEvent(""), this)
			: createPointerEventsForMouseOfTypeAndDispatch("lostpointercapture", new MouseEvent(""), this);
	};
}
