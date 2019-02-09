import {PointerEventType} from "./pointer-event-type";

export const pointerIdToCancelFiredSet: Set<number> = new Set();

/**
 * Updates the PointerIdToCancelFiredSet
 * @param {{type: PointerEventType, pointerId: number}} e
 */
export function updatePointerIdToCancelFiredSet({type, pointerId}: {type: PointerEventType; pointerId: number}): void {
	switch (type) {
		case "pointercancel":
			pointerIdToCancelFiredSet.add(pointerId);
			break;

		case "pointerdown":
		case "pointerup":
			pointerIdToCancelFiredSet.delete(pointerId);
			break;
	}
}
