import {PointerEventType} from "../pointer-event-type";
import {PointerEvent} from "../pointer-event";
import {SHARED_DESCRIPTOR_OPTIONS} from "../shared-descriptor-options";
import {getPressure} from "../touch/get-touch-properties";
import {DynamicPointerEventProperty} from "../dynamic-pointer-event-property";
import {IPointerEventInitRequired} from "../i-pointer-event-init-required";
import {canBubble} from "../can-bubble";
import {isCancelable} from "../is-cancelable";
import {overwriteTargetsForEvent} from "../overwrite-targets-for-event";
import {OptionalOverwrittenMouseEventProperties, RequiredOverwrittenMouseEventProperties} from "../overwritten-mouse-event-properties";
import {cloneEventAsPointerEvent} from "../clone-event-as-pointer-event";
import {currentMousePointerId} from "./current-mouse-pointer-id";
import {updatePointerIdToCancelFiredSet} from "../pointer-id-to-cancel-fired";
import {invokeListener} from "../invoke-listener";
import {getMouseTarget} from "./get-mouse-properties";
import {POINTER_ID_TO_CAPTURED_TARGET_MAP} from "../pointer-capture";
import {isElement} from "../is-element";
import {IDisposable} from "../i-disposable";

// tslint:disable:no-any

/**
 * A Map between Event Targets and disposable objects
 * @type {Map<EventTarget, IDisposable>}
 */
const POINTER_UP_FALLBACK_LISTENER_MAP: Map<EventTarget, IDisposable> = new Map();

/**
 * Dispatches a 'pointerup' event the next time a 'mouseup' event is fired on the window
 * @param {MouseEvent} e
 * @returns {IDisposable}
 */
function dispatchPointerUpForPointerEventOnNextGlobalUpEvent (e: MouseEvent): IDisposable {
	const {target, currentTarget} = e;

	const dispose = () => {
		window.removeEventListener("mouseup", handler);
	};

	const handler = (upEvent: MouseEvent) => {

		// Use the coordinate-specific values from the mouseup event and set it on the constructed 'pointerup' event
		const {left, top} = isElement(currentTarget) ? currentTarget.getBoundingClientRect() : {left: 0, top: 0};

		createPointerEventsForMouseOfTypeAndDispatch("pointerup", e, currentTarget!, {
			target: {
				value: target, ...SHARED_DESCRIPTOR_OPTIONS
			},

			currentTarget: {
				value: currentTarget, ...SHARED_DESCRIPTOR_OPTIONS
			},

			clientX: {
				value: upEvent.clientX, ...SHARED_DESCRIPTOR_OPTIONS
			},

			clientY: {
				value: upEvent.clientY, ...SHARED_DESCRIPTOR_OPTIONS
			},

			screenX: {
				value: upEvent.screenX, ...SHARED_DESCRIPTOR_OPTIONS
			},

			screenY: {
				value: upEvent.screenY, ...SHARED_DESCRIPTOR_OPTIONS
			},

			layerX: {
				value: upEvent.layerX, ...SHARED_DESCRIPTOR_OPTIONS
			},

			layerY: {
				value: upEvent.layerY, ...SHARED_DESCRIPTOR_OPTIONS
			},

			movementX: {
				value: upEvent.movementX, ...SHARED_DESCRIPTOR_OPTIONS
			},

			movementY: {
				value: upEvent.movementY, ...SHARED_DESCRIPTOR_OPTIONS
			},

			offsetX: {
				value: upEvent.clientX - left, ...SHARED_DESCRIPTOR_OPTIONS
			},

			offsetY: {
				value: upEvent.clientY - top, ...SHARED_DESCRIPTOR_OPTIONS
			},

			pageX: {
				value: upEvent.pageX, ...SHARED_DESCRIPTOR_OPTIONS
			},

			pageY: {
				value: upEvent.pageY, ...SHARED_DESCRIPTOR_OPTIONS
			},

			x: {
				value: upEvent.x, ...SHARED_DESCRIPTOR_OPTIONS
			},

			y: {
				value: upEvent.y, ...SHARED_DESCRIPTOR_OPTIONS
			}
		});

		dispose();
	};
	window.addEventListener("mouseup", handler);
	return {dispose};
}

/**
 * Handles whatever logic needs to come before any given kind of MouseEvent
 * @param {PointerEventType} _pointerEventType
 * @param {EventTarget} _eventTarget
 * @param {MouseEvent} _e
 */
function handlePrePointerEventForMouse (_pointerEventType: PointerEventType, _eventTarget: EventTarget, _e: MouseEvent): void {
	// There's nothing to do here
}

/**
 * Handles whatever logic needs to follow any given kind of MouseEvent
 * @param {PointerEventType} pointerEventType
 * @param {MouseEvent} e
 */
function handlePostPointerEventForMouse (pointerEventType: PointerEventType, e: MouseEvent): void {
	switch (pointerEventType) {

		case "pointercancel":
		case "pointerup":

			// Clean up after the global "pointerup" listener, if it exists
			if (e.currentTarget != null && POINTER_UP_FALLBACK_LISTENER_MAP.has(e.currentTarget)) {
				const handler = POINTER_UP_FALLBACK_LISTENER_MAP.get(e.currentTarget)!;
				// Clear the global listener for "mouseup" events
				handler.dispose();
				POINTER_UP_FALLBACK_LISTENER_MAP.delete(e.currentTarget);
			}

			// Immediately after pointerup or pointercancel events, a user agent MUST clear any pointer capture target overrides
			// https://www.w3.org/TR/pointerevents/#implicit-release-of-pointer-capture
			const match = POINTER_ID_TO_CAPTURED_TARGET_MAP.get(currentMousePointerId);
			if (match != null && isElement(match)) {
				match.releasePointerCapture(currentMousePointerId);
			}

			break;

		case "pointerdown":
			if (e.currentTarget != null && !POINTER_UP_FALLBACK_LISTENER_MAP.has(e.currentTarget)) {
				POINTER_UP_FALLBACK_LISTENER_MAP.set(e.currentTarget, dispatchPointerUpForPointerEventOnNextGlobalUpEvent(e));
			}
	}
}

/**
 * Handles all those dynamic properties that are specific for pointerdown or pointerup events on Mouse devices
 * @param {number} pointerId
 * @param {string} type
 * @param {MouseEvent} e
 * @returns {{[Key in DynamicPointerEventProperty]: PropertyDescriptor}}
 */
function handleDynamicPropertiesForContactMouse (pointerId: number, type: "pointerdown"|"pointermove"|"pointerover"|"pointerenter"|"pointerup"|"gotpointercapture"|"lostpointercapture", e: MouseEvent): { [Key in DynamicPointerEventProperty]: PropertyDescriptor } {
	return {
		target: {
			value: getMouseTarget(pointerId, e), ...SHARED_DESCRIPTOR_OPTIONS
		},

		button: {
			// If the pointer is simply over the element, no pointer contact has changed since last event.
			// https://www.w3.org/TR/pointerevents2/#the-button-property
			value: type === "pointerover" || type === "gotpointercapture" ? -1 : type === "lostpointercapture" ? 0 : e.button, ...SHARED_DESCRIPTOR_OPTIONS
		},

		buttons: {
			value: type === "lostpointercapture" ? 0 : type === "gotpointercapture" ? 1 : e.buttons, ...SHARED_DESCRIPTOR_OPTIONS
		},

		clientX: {
			value: e.clientX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		clientY: {
			value: e.clientY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		screenX: {
			value: e.screenX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		screenY: {
			value: e.screenY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		layerX: {
			value: e.layerX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		layerY: {
			value: e.layerY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		movementX: {
			value: e.movementX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		movementY: {
			value: e.movementY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		offsetX: {
			value: e.offsetX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		offsetY: {
			value: e.offsetY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		pageX: {
			value: e.pageX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		pageY: {
			value: e.pageY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		x: {
			value: e.x, ...SHARED_DESCRIPTOR_OPTIONS
		},

		y: {
			value: e.y, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// For everything other than pointerover/pointerleave/pointerout/pointerenter, the related target should be null
		// https://www.w3.org/TR/pointerevents2/
		relatedTarget: {
			value: null, ...SHARED_DESCRIPTOR_OPTIONS
		},
		// The width and height of active mouse and pen pointers are always equal to 1
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		width: {
			value: 1, ...SHARED_DESCRIPTOR_OPTIONS
		},
		height: {
			value: 1, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// if the device doesn't support pressure (mice and pens doesn't), the pressure is always 0.5 except for "up" events (which is zero)
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		pressure: {
			value: getPressure(type, e), ...SHARED_DESCRIPTOR_OPTIONS
		},

		// if the device doesn't support tangential pressure (mice and pens doesn't), the value is always 0
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		tangentialPressure: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// Mouse pointers doesn't support tilt. Default to values of zero
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		tiltX: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		},
		tiltY: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// Mouse pointers doesn't support twist. Default to values of zero
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		twist: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		}
	};
}

/**
 * Handles all those dynamic properties that are specific for pointerout or pointerleave events on Mouse devices
 * @param {number} pointerId
 * @param {MouseEvent} e
 * @returns {{[Key in DynamicPointerEventProperty]: PropertyDescriptor}}
 */
function handleDynamicPropertiesForNoContactMouse (pointerId: number, e: MouseEvent): { [Key in DynamicPointerEventProperty]: PropertyDescriptor } {
	return {
		target: {
			value: getMouseTarget(pointerId, e), ...SHARED_DESCRIPTOR_OPTIONS
		},

		button: {
			value: e.button, ...SHARED_DESCRIPTOR_OPTIONS
		},

		buttons: {
			value: e.buttons, ...SHARED_DESCRIPTOR_OPTIONS
		},

		clientX: {
			value: e.clientX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		clientY: {
			value: e.clientY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		screenX: {
			value: e.screenX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		screenY: {
			value: e.screenY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		layerX: {
			value: e.layerX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		layerY: {
			value: e.layerY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		movementX: {
			value: e.movementX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		movementY: {
			value: e.movementY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		offsetX: {
			value: e.offsetX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		offsetY: {
			value: e.offsetY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		pageX: {
			value: e.pageX, ...SHARED_DESCRIPTOR_OPTIONS
		},

		pageY: {
			value: e.pageY, ...SHARED_DESCRIPTOR_OPTIONS
		},

		x: {
			value: e.x, ...SHARED_DESCRIPTOR_OPTIONS
		},

		y: {
			value: e.y, ...SHARED_DESCRIPTOR_OPTIONS
		},

		relatedTarget: {
			value: e.relatedTarget, ...SHARED_DESCRIPTOR_OPTIONS
		},
		// The width and height of active mouse and pen pointers are always equal to 1
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		width: {
			value: 1, ...SHARED_DESCRIPTOR_OPTIONS
		},
		height: {
			value: 1, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// if the device doesn't support pressure (mice and pens doesn't), the pressure is always 0.5 except for "up" events (which is zero)
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		pressure: {
			value: getPressure("pointerout", e), ...SHARED_DESCRIPTOR_OPTIONS
		},

		// if the device doesn't support tangential pressure (mice and pens doesn't), the value is always 0
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		tangentialPressure: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// Mouse pointers doesn't support tilt. Default to values of zero
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		tiltX: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		},
		tiltY: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// Mouse pointers doesn't support twist. Default to values of zero
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		twist: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		}
	};
}

/**
 * Handles all those dynamic properties that are specific for a specific PointerEvent type on Mouse devices
 * @param {number} pointerId
 * @param {PointerEventType} type
 * @param {MouseEvent} e
 * @returns {{[Key in DynamicPointerEventProperty]: PropertyDescriptor}}
 */
function handleDynamicPropertiesForPointerEventOnMouse (pointerId: number, type: PointerEventType, e: MouseEvent): { [Key in DynamicPointerEventProperty]: PropertyDescriptor } {
	switch (type) {

		case "pointerdown":
		case "pointermove":
		case "pointerup":
		case "pointerover":
		case "pointerenter":
		case "gotpointercapture":
		case "lostpointercapture":
			return handleDynamicPropertiesForContactMouse(pointerId, type, e);

		case "pointerout":
		case "pointerleave":
		case "pointercancel":
			return handleDynamicPropertiesForNoContactMouse(pointerId, e);

		default:
			throw new TypeError(`Error: Could not handle dynamic properties for a PointerEvent of type: '${type}'`);
	}
}

/**
 * Creates a PointerEvent based on a MouseEvent of the given type
 * @param {PointerEventType} type
 * @param {MouseEvent} e
 * @returns {PointerEvent[]}
 */
function createPointerEventsForMouseOfType (type: PointerEventType, e: MouseEvent): PointerEvent[] {
	const pointerId = currentMousePointerId;

	const initOptions: IPointerEventInitRequired = {
		...<MouseEventInit>e,

		// Mice are always active pointers, so their pointer ids won't increment
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		pointerId,
		pointerType: "mouse",

		// Mouse pointers are always active and always considered primary, even if multiple mouse devices are connected
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		isPrimary: true,

		bubbles: canBubble(type, e),
		cancelable: isCancelable(type, e)
	};

	// Prevent the event if the pointer id is currently being caught by an EventTarget
	const shouldPreventBecausePointerCapture = (type === "pointerout" || type === "pointerleave") && POINTER_ID_TO_CAPTURED_TARGET_MAP.has(pointerId);

	if (shouldPreventBecausePointerCapture) {
		if (e.cancelable && !e.defaultPrevented) {
			e.preventDefault();
		}
		return [];
	}

	// Define all properties of MouseEvents that should be set on the event object
	// noinspection JSDeprecatedSymbols
	const overwrittenMouseEventProperties: { [Key in RequiredOverwrittenMouseEventProperties]: PropertyDescriptor }&{ [Key in OptionalOverwrittenMouseEventProperties]?: PropertyDescriptor } = {

		scoped: {
			value: (<any>e).scoped, ...SHARED_DESCRIPTOR_OPTIONS
		},

		deepPath: {
			value: e.deepPath, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// The 'fromElement' property should be set to 'null' for interoperability reasons according to the spec
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		fromElement: {
			value: null, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// The 'toElement' property should be set to 'null' for interoperability reasons according to the spec
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		toElement: {
			value: null, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// The 'detail' property should always have a value of 0
		// https://www.w3.org/TR/pointerevents/#attributes-and-default-actions
		detail: {
			value: 0, ...SHARED_DESCRIPTOR_OPTIONS
		},

		// The 'composed' property should always have a value of true
		// https://www.w3.org/TR/pointerevents/#attributes-and-default-actions
		composed: {
			value: true, ...SHARED_DESCRIPTOR_OPTIONS
		},

		...(!("region" in MouseEvent.prototype) ? {} : {
			region: {
				value: (<any>e).region, ...SHARED_DESCRIPTOR_OPTIONS
			}
		}),

		...(!("path" in e) ? {} : {
			path: {
				// Touch contact are indicated by the button value 0
				value: (<any>e).path, ...SHARED_DESCRIPTOR_OPTIONS
			}
		})
	};

	// Create a new PointerEvent
	const clonedEvent = cloneEventAsPointerEvent({
		e,
		type,
		initOptions,
		overwrittenMouseEventProperties,
		dynamicPropertiesHandler: () => handleDynamicPropertiesForPointerEventOnMouse(pointerId, type, e)
	});
	overwriteTargetsForEvent(e, clonedEvent.target, clonedEvent.currentTarget, clonedEvent.relatedTarget);
	return [clonedEvent];
}

/**
 * Creates a PointerEvent based on a TouchEvent of the given type and dispatches an event on the event target
 * @param {PointerEventType} type
 * @param {TouchEvent} e
 * @param {EventTarget} eventTarget
 * @param {PropertyDescriptorMap} [extraDescriptors]
 */
export function createPointerEventsForMouseOfTypeAndDispatch (type: PointerEventType, e: MouseEvent, eventTarget: EventTarget, extraDescriptors?: PropertyDescriptorMap): void {
	const pointerEvents = createPointerEventsForMouseOfType(type, e);
	// Handle whatever needs to come before the MouseEvent
	handlePrePointerEventForMouse(type, eventTarget, e);

	pointerEvents.forEach(clone => {
		if (extraDescriptors != null) {
			Object.defineProperties(clone, extraDescriptors);
		}

		updatePointerIdToCancelFiredSet(clone);

		// Dispatch the event on the target
		eventTarget.dispatchEvent(clone);
	});

	// Handle whatever needs to come after the MouseEvent
	handlePostPointerEventForMouse(type, e);
}

/**
 * Creates a PointerEvent based on a MouseEvent of the given type and invokes the listener with it
 * @param {PointerEventType} type
 * @param {MouseEvent} e
 * @param {EventTarget} eventTarget
 * @param {EventListenerOrEventListenerObject} listener
 */
function createPointerEventsForMouseOfTypeAndInvoke (type: PointerEventType, e: MouseEvent, eventTarget: EventTarget, listener: EventListenerOrEventListenerObject): void {
	// Handle whatever needs to come before the MouseEvent
	handlePrePointerEventForMouse(type, eventTarget, e);
	const pointerEvents = createPointerEventsForMouseOfType(type, e);

	pointerEvents.forEach(clone => {
		updatePointerIdToCancelFiredSet(clone);

		// Invoke the listener with the cloned event
		invokeListener(clone, listener);
	});

	// Handle whatever needs to come after the MouseEvent
	handlePostPointerEventForMouse(type, e);
}

/**
 * Handles a PointerEvent related to a MouseEvent
 * @param {EventTarget} eventTarget
 * @param {PointerEventType} type
 * @param {MouseEvent} e
 * @param {EventListenerOrEventListenerObject} listener
 */
export function handlePointerEventForMouse (eventTarget: EventTarget, type: PointerEventType, e: MouseEvent, listener: EventListenerOrEventListenerObject): void {
	createPointerEventsForMouseOfTypeAndInvoke(type, e, eventTarget, listener);
}