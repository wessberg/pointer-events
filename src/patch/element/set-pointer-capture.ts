import {POINTER_ID_TO_CAPTURED_TARGET_MAP} from "../../pointer-capture";
import {HAS_POINTER_LOCK} from "../../pointer-lock";
import {isTouchDevice} from "../../is-touch-device";
import {createPointerEventsForTouchOfTypeAndDispatch} from "../../touch/touch-handler";
import {createPointerEventsForMouseOfTypeAndDispatch} from "../../mouse/mouse-handler";
import {SUPPORTS_POINTER_EVENTS} from "../window/pointer-event-check";
import {SEEN_POINTER_IDS} from "../../seen-pointer-ids";
import {throwDOMException} from "../../throw-dom-exception";

if (!SUPPORTS_POINTER_EVENTS) {

	/**
	 * Sets pointer capture for the pointer identified by the argument pointerId to the element on which
	 * this method is invoked
	 * https://www.w3.org/TR/pointerevents/#extensions-to-the-element-interface
	 * @param {number} pointerId
	 */
	Element.prototype.setPointerCapture = function (pointerId: number): void {

		// If no active pointer exists with the given pointer id, throw a DOMException
		// with name 'InvalidPointerId'
		// https://www.w3.org/TR/pointerevents/#setting-pointer-capture
		if (!SEEN_POINTER_IDS.has(pointerId)) {
			throwDOMException(`Could not set pointer capture on an element: No active pointers exist with the given pointer id: '${pointerId}'`, "InvalidPointerId");
		}

		// If the element is not connected, throw an InvalidStateError
		// https://www.w3.org/TR/pointerevents/#setting-pointer-capture
		if (!this.isConnected) {
			throwDOMException(`Could not set pointer capture on an element: It wasn't connected!`, "InvalidStateError");
		}

		if (HAS_POINTER_LOCK()) {
			throwDOMException(`Could not set pointer capture on an element: The document had a PointerLock!`, "InvalidStateError");
		}

		// Otherwise, mark the pointer id as captured by this element
		POINTER_ID_TO_CAPTURED_TARGET_MAP.set(pointerId, this);

		isTouchDevice
			? createPointerEventsForTouchOfTypeAndDispatch("gotpointercapture", new TouchEvent(""), this)
			: createPointerEventsForMouseOfTypeAndDispatch("gotpointercapture", new MouseEvent(""), this);
	};
}