import {currentPenOrTouchPointerId} from "./current-touch-pointer-id";

/**
 * Gets a PointerId from a Touch
 * @param {Touch} touch
 * @returns {number}
 */
export function getPointerIdFromTouch(touch: Touch): number {
	return touch.identifier + currentPenOrTouchPointerId;
}
