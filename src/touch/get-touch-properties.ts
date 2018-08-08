import {POINTER_EVENT_DEFAULT_VALUES} from "../pointer-event-default-values";
import {PointerEventType} from "../pointer-event-type";
import {findNearestRoot} from "../find-nearest-root";
import {isElement} from "../is-element";
import {POINTER_ID_TO_CAPTURED_TARGET_MAP} from "../pointer-capture";

// tslint:disable:no-any

/**
 * Retrieves the width of a touch
 * @param {Touch} touch
 * @returns {number}
 */
export function getTouchWidth (touch: Touch): number {
	if ("radiusX" in touch) return (<any>touch).radiusX * 2;
	else if ("webkitRadiusX" in touch) return (<any>touch).webkitRadiusX * 2;
	else {
		return POINTER_EVENT_DEFAULT_VALUES.width;
	}
}

/**
 * Retrieves the height of a touch
 * @param {Touch} touch
 * @returns {number}
 */
export function getTouchHeight (touch: Touch): number {
	if ("radiusY" in touch) return (<any>touch).radiusY * 2;
	else if ("webkitRadiusY" in touch) return (<any>touch).webkitRadiusY * 2;
	else {
		return POINTER_EVENT_DEFAULT_VALUES.height;
	}
}

/**
 * Gets the pressure of the current touch, depending on the type of event
 * @param {PointerEventType} type
 * @param {MouseEvent | Touch} touchOrMouseEvent
 * @returns {number}
 */
export function getPressure (type: PointerEventType, touchOrMouseEvent: MouseEvent|Touch): number {
	if (type === "pointerup") {
		return 0;
	}
	else if ("force" in touchOrMouseEvent) return (<any>touchOrMouseEvent).force;
	else if ("webkitForce" in touchOrMouseEvent) return (<any>touchOrMouseEvent).webkitForce;
	else {
		return POINTER_EVENT_DEFAULT_VALUES.pressure;
	}
}

/**
 * Gets the 'twist' value of a Touch event
 * @param {Touch} touch
 * @returns {number}
 */
export function getTouchTwist (touch: Touch): number {
	if ("rotationAngle" in touch) return (<any>touch).rotationAngle;
	else if ("webkitRotationAngle" in touch) return (<any>touch).webkitRotationAngle;
	else {
		return POINTER_EVENT_DEFAULT_VALUES.twist;
	}
}

/**
 * If the event is "pointermove", and if the target is given and is an element,
 * use whatever element is currently under the cursor.
 * @param {number} pointerId
 * @param {PointerEventType} type
 * @param {TouchEvent} e
 * @param {Touch} touch
 * @returns {EventTarget | null}
 */
export function getTouchTarget (pointerId: number, type: PointerEventType, e: TouchEvent, touch: Touch): EventTarget|null {
	const captured = POINTER_ID_TO_CAPTURED_TARGET_MAP.get(pointerId);
	if (captured !== undefined) return captured;

	if (type !== "pointermove" || !isElement(e.target) || !isElement(e.currentTarget)) return e.target;

	return findNearestRoot(e.currentTarget).elementFromPoint(touch.clientX, touch.clientY);

}