import {getParent} from "./get-parent";

// tslint:disable:no-any

/**
 * Finds the nearest root from an element
 * @param {Element} target
 * @returns {DocumentOrShadowRoot}
 */
export function findNearestRoot(target: Element): DocumentOrShadowRoot {
	let currentElement: EventTarget | null = target;
	while (currentElement != null) {
		if ("ShadowRoot" in window && currentElement instanceof (<any>window).ShadowRoot) {
			// Assume this is a ShadowRoot
			return <ShadowRoot>currentElement;
		}

		const parent = getParent(currentElement);

		if (parent === currentElement) {
			return document;
		}

		currentElement = parent;
	}
	return document;
}
