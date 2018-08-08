export const boundHandlerMap: Map<EventListenerOrEventListenerObject, Set<Function>> = new Map();

/**
 * Adds a bound handler
 * @param {EventListenerOrEventListenerObject} listener
 * @param {Function} handler
 */
export function addBoundHandler (listener: EventListenerOrEventListenerObject, handler: Function): void {
	let set = boundHandlerMap.get(listener);
	if (set == null) {
		set = new Set();
		boundHandlerMap.set(listener, set);
	}
	set.add(handler);
}