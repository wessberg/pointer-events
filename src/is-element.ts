/**
 * Returns true if the given event target is an element
 * @param {EventTarget|null} eventTarget
 * @returns {eventTarget is Element}
 */
export function isElement (eventTarget: EventTarget|null): eventTarget is HTMLElement {
	return eventTarget != null && "offsetLeft" in eventTarget;
}