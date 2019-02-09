import {getParent} from "./get-parent";

/**
 * Gets the event path from a target
 * @param {Element} target
 * @returns {Element[]}
 */
export function getEventPath(target: Element): EventTarget[] {
	const path: EventTarget[] = [];
	let currentElement: EventTarget | null = target;
	while (currentElement != null) {
		path.push(currentElement);
		currentElement = getParent(currentElement);

		// If the last Node is equal to the latest parentNode, break immediately
		if (path[path.length - 1] === currentElement) break;
	}
	return path;
}
