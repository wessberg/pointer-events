import {getParent} from "./get-parent";
import {ITouchActionAncestor, TouchAction} from "./i-touch-action-ancestor";

const styleDeclarationPropertyName = <keyof CSSStyleDeclaration> "touchAction";
const styleAttributePropertyName = "touch-action";
const styleAttributePropertyNameRegex = new RegExp(`${styleAttributePropertyName}:\\s*([^;]*)`);

/**
 * Finds all ancestors and their touch-action values
 * @param {Element} target
 * @returns {ITouchActionAncestor[]}
 */
export function findNearestAncestorsWithTouchAction (target: Element): ITouchActionAncestor[] {
	const path: ITouchActionAncestor[] = [];
	let currentElement: EventTarget|null = target;
	while (currentElement != null) {
		let touchActionPropertyValue: string|null = null;
		if ("style" in currentElement) {
			touchActionPropertyValue = (<HTMLElement>currentElement).style[styleDeclarationPropertyName];

			if (touchActionPropertyValue == null || touchActionPropertyValue === "") {
				const styleAttributeValue = (<HTMLElement>currentElement).getAttribute("style");
				if (styleAttributeValue != null && styleAttributeValue.includes(styleAttributePropertyName)) {
					const match = styleAttributeValue.match(styleAttributePropertyNameRegex);
					if (match != null) {
						const [, values] = match;
						touchActionPropertyValue = values;
					}
				}
			}

			if (touchActionPropertyValue != null) {
				path.push({
					element: currentElement, touchAction: new Set(<TouchAction[]>touchActionPropertyValue
						.split(/\s/)
						.map(part => part.trim())
					)
				});
			}
		}

		const parent = getParent(currentElement);
		// If the last Node is equal to the latest parentNode, break immediately
		if (parent === currentElement) break;
		currentElement = parent;
	}
	return path;
}