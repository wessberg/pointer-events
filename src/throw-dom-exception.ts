/**
 * Throws a DOMException if possible, otherwise it falls back to throwing a regular error
 * @param {string} message
 * @param {string} name
 */
export function throwDOMException (message?: string, name?: string): void {
	let exception: DOMException|Error;
	try {
		exception = new DOMException(message, name);
	} catch (ex) {
		exception = new Error(`${name}: ${message}`);
		if (name != null) {
			exception.name = name;
		}
	}

	throw exception;
}