import {POINTER_ID_TO_CAPTURED_TARGET_MAP} from "../pointer-capture";

/**
 * Gets the target for a MouseEvent
 * @param {number} pointerId
 * @param {MouseEvent} e
 * @returns {EventTarget | null}
 */
export function getMouseTarget(pointerId: number, e: MouseEvent): EventTarget | null {
	const captured = POINTER_ID_TO_CAPTURED_TARGET_MAP.get(pointerId);
	if (captured !== undefined) {
		return captured;
	}
	return e.target;
}
