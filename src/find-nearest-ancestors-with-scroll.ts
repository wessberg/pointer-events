import {IScrollAncestor} from "./i-scroll-ancestor";
import {getParent} from "./get-parent";

/**
 * Finds the nearest ancestor of an element that can scroll
 * @param {Element} target
 * @returns {IScrollAncestor}
 */
export function findNearestAncestorsWithScroll(target: Element): IScrollAncestor[] {
	const path: IScrollAncestor[] = [];
	let currentElement: EventTarget | null = target;
	while (currentElement != null) {
		if ("style" in currentElement) {
			const computedStyle = getComputedStyle(currentElement);
			const overflow = computedStyle.getPropertyValue("overflow");
			const canScrollX = overflow.startsWith("visible") || overflow.startsWith("scroll");
			const canScrollY = overflow.endsWith("visible") || overflow.endsWith("scroll");
			const canScroll = canScrollX || canScrollY;
			if (canScroll) {
				path.push({canScrollX, canScrollY, scrollElement: currentElement});
			}
		}

		const parent = getParent(currentElement);
		// If the last Node is equal to the latest parentNode, break immediately
		if (parent === currentElement) break;
		currentElement = parent;
	}
	return path;
}
