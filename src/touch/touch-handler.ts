import {SHARED_DESCRIPTOR_OPTIONS} from "../shared-descriptor-options";
import {PointerEventType} from "../pointer-event-type";
import {PointerEvent} from "../pointer-event";
import {DynamicPointerEventProperty} from "../dynamic-pointer-event-property";
import {POINTER_EVENT_DEFAULT_VALUES} from "../pointer-event-default-values";
import {isElement} from "../is-element";
import {getPressure, getTouchHeight, getTouchTarget, getTouchTwist, getTouchWidth} from "./get-touch-properties";
import {getEventPath} from "../get-event-path";
import {IScrollAncestor} from "../i-scroll-ancestor";
import {findNearestAncestorsWithScroll} from "../find-nearest-ancestors-with-scroll";
import {overwriteTargetsForEvent} from "../overwrite-targets-for-event";
import {getPointerIdFromTouch} from "./get-pointer-id-from-touch";
import {IPointerEventInitRequired} from "../i-pointer-event-init-required";
import {isCancelable} from "../is-cancelable";
import {canBubble} from "../can-bubble";
import {OptionalOverwrittenMouseEventProperties, RequiredOverwrittenMouseEventProperties} from "../overwritten-mouse-event-properties";
import {cloneEventAsPointerEvent} from "../clone-event-as-pointer-event";
import {pointerIdToCancelFiredSet, updatePointerIdToCancelFiredSet} from "../pointer-id-to-cancel-fired";
import {invokeListener} from "../invoke-listener";
import {POINTER_ID_TO_CAPTURED_TARGET_MAP} from "../pointer-capture";
import {findNearestAncestorsWithTouchAction} from "../find-nearest-ancestors-with-touch-action";

// tslint:disable:no-any

// tslint:disable:no-identical-conditions

// tslint:disable:no-collapsible-if

/**
 * The name of the property to extend TouchEvents with
 * @type {string}
 */
const TOUCH_ACTION_PROPERTY_NAME = "___touchAction___";

/**
 * How great the different between a touchstart and touchmove before it is determined that panning is undergoing
 * @type {number}
 */
const PANNING_DIFFERENCE_THRESHOLD: number = 5;

/**
 * The PointerEvents to track during scrolling
 * @type {(string)[]}
 */
const POINTER_EVENTS_TO_TRACK: PointerEventType[] = ["pointercancel", "pointerleave", "pointerup", "pointerout"];
const LAST_POINTER_DOWN_EVENT_FOR_POINTER_ID: Map<number, PointerEvent> = new Map();

/**
 * Handles all those dynamic properties that are specific for a specific PointerEvent type on Touch devices
 * @param {number} pointerId
 * @param {PointerEventType} type
 * @param {Touch} currentTouch
 * @param {TouchEvent} e
 * @returns {{[Key in DynamicPointerEventProperty]: PropertyDescriptor}}
 */
function handleDynamicPropertiesForPointerEventOnTouch(pointerId: number, type: PointerEventType, currentTouch: Touch, e: TouchEvent): {[Key in DynamicPointerEventProperty]: PropertyDescriptor} {
	switch (type) {
		case "pointerdown":
		case "pointermove":
		case "pointerup":
		case "pointerover":
		case "pointerenter":
		case "gotpointercapture":
		case "lostpointercapture":
			return handleDynamicPropertiesForContactTouch(pointerId, type, currentTouch, e);

		case "pointercancel":
		case "pointerout":
		case "pointerleave":
			return handleDynamicPropertiesForNoContactTouch(pointerId, type, currentTouch, e);

		default:
			throw new TypeError(`Error: Could not handle dynamic properties for a PointerEvent of type: '${type}'`);
	}
}

/**
 * Handles all those dynamic properties that are specific for pointercancel/pointerleave/pointerout events on Touch devices
 * @param {number} pointerId
 * @param {PointerEventType} type
 * @param {Touch} touch
 * @param {TouchEvent} e
 * @returns {{[Key in DynamicPointerEventProperty]: PropertyDescriptor}}
 */
function handleDynamicPropertiesForNoContactTouch(pointerId: number, type: PointerEventType, touch: Touch, e: TouchEvent): {[Key in DynamicPointerEventProperty]: PropertyDescriptor} {
	return {
		target: {
			value: getTouchTarget(pointerId, type, e, touch),
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// For everything other than pointerover/pointerleave/pointerout/pointerenter, the related target should be null
		// https://www.w3.org/TR/pointerevents2/
		relatedTarget: {
			value: null,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		button: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		buttons: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		clientX: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		clientY: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		width: {
			value: POINTER_EVENT_DEFAULT_VALUES.width,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		height: {
			value: POINTER_EVENT_DEFAULT_VALUES.height,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		pressure: {
			value: POINTER_EVENT_DEFAULT_VALUES.pressure,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		tangentialPressure: {
			value: POINTER_EVENT_DEFAULT_VALUES.tangentialPressure,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		tiltX: {
			value: POINTER_EVENT_DEFAULT_VALUES.tiltX,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		tiltY: {
			value: POINTER_EVENT_DEFAULT_VALUES.tiltY,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		twist: {
			value: POINTER_EVENT_DEFAULT_VALUES.twist,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		layerX: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		layerY: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		movementX: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		movementY: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		offsetX: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		offsetY: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		pageX: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		pageY: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		screenX: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		screenY: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		x: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		y: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		}
	};
}

/**
 * Handles all those dynamic properties that are specific for pointercancel events on Touch devices
 * @param {number} pointerId
 * @param {string} type
 * @param {Touch} currentTouch
 * @param {TouchEvent} e
 * @returns {{[Key in DynamicPointerEventProperty]: PropertyDescriptor}}
 */
function handleDynamicPropertiesForContactTouch(
	pointerId: number,
	type: "pointerdown" | "pointermove" | "pointerover" | "pointerenter" | "pointerup" | "gotpointercapture" | "lostpointercapture",
	currentTouch: Touch,
	e: TouchEvent
): {[Key in DynamicPointerEventProperty]: PropertyDescriptor} {
	const offsetX = currentTouch.clientX - (isElement(currentTouch.target) ? currentTouch.target.offsetLeft : 0);
	const offsetY = currentTouch.clientY - (isElement(currentTouch.target) ? currentTouch.target.offsetTop : 0);
	const offsetParent = "offsetParent" in currentTouch.target ? <HTMLElement>currentTouch.target : null;
	const layerX = offsetParent == null ? offsetX : currentTouch.clientX - offsetParent.offsetLeft;
	const layerY = offsetParent == null ? offsetY : currentTouch.clientY - offsetParent.offsetTop;

	return {
		target: {
			value: getTouchTarget(pointerId, type, e, currentTouch),
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// For everything other than pointerover/pointerleave/pointerout/pointerenter, the related target should be null
		// https://www.w3.org/TR/pointerevents2/
		relatedTarget: {
			value: null,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		button: {
			// Touch contact are indicated by the button value 0
			value: type === "gotpointercapture" ? -1 : 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		buttons: {
			// During Touch contact, there is a single button in use, hence the value of 1
			value: type === "pointerup" || type === "lostpointercapture" ? 0 : 1,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		clientX: {
			value: currentTouch.clientX,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		clientY: {
			value: currentTouch.clientY,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		screenX: {
			value: currentTouch.screenX,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		screenY: {
			value: currentTouch.screenY,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		pageX: {
			value: currentTouch.pageX,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		pageY: {
			value: currentTouch.pageY,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		x: {
			value: currentTouch.clientX,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		y: {
			value: currentTouch.clientY,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		offsetX: {
			value: offsetX,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		offsetY: {
			value: offsetY,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		layerX: {
			value: layerX,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		layerY: {
			value: layerY,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// For both pointerdown and pointer up events, there has been no movement since the previous event. This is only applicable to pointermove events
		movementX: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// For both pointerdown and pointer up events, there has been no movement since the previous event. This is only applicable to pointermove events
		movementY: {
			value: 0,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// The width and height in CSS pixels of the contact geometry of the pointer.
		// Will use the radiusX or webkitRadiusX properties of Touch Events to determine this
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		width: {
			value: getTouchWidth(currentTouch),
			...SHARED_DESCRIPTOR_OPTIONS
		},
		height: {
			value: getTouchHeight(currentTouch),
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// Some browsers like iOS safari reports force values for touches which we can use to determine the pressure.
		// For "pointerup" events, the pressure will always be 0
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		pressure: {
			value: getPressure(type, currentTouch),
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// There is no known way to detect the tangential pressure currently, so we just default to setting this to 0
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		tangentialPressure: {
			value: POINTER_EVENT_DEFAULT_VALUES.tangentialPressure,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// Touch pointers doesn't support tilt. Default to values of zero
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		tiltX: {
			value: POINTER_EVENT_DEFAULT_VALUES.tiltX,
			...SHARED_DESCRIPTOR_OPTIONS
		},
		tiltY: {
			value: POINTER_EVENT_DEFAULT_VALUES.tiltY,
			...SHARED_DESCRIPTOR_OPTIONS
		},

		// Gets the rotation angle, in degrees, of the contact area ellipse
		// https://www.w3.org/TR/pointerevents/#pointerevent-interface
		twist: {
			value: getTouchTwist(currentTouch),
			...SHARED_DESCRIPTOR_OPTIONS
		}
	};
}

/**
 * Handles whatever logic needs to come before any given kind of TouchEvent
 * @param {PointerEventType} pointerEventType
 * @param {EventTarget} eventTarget
 * @param {TouchEvent} e
 * @param {PointerEvent[]} pointerEvents
 */
function handlePrePointerEventForTouch(pointerEventType: PointerEventType, eventTarget: EventTarget, e: TouchEvent, pointerEvents: PointerEvent[]): void {
	switch (pointerEventType) {
		case "pointermove":
			if (isElement(e.target) && isElement(e.currentTarget)) {
				const touchAction = e[<keyof TouchEvent>TOUCH_ACTION_PROPERTY_NAME];

				// If only panning in the [x|y]-axis is allowed, test if panning is attempted in the [x|y]-axis and prevent it if that is the case
				if (touchAction !== "auto") {
					pointerEvents.forEach(({pointerId, clientX, clientY}) => {
						if (e.cancelable && !e.defaultPrevented) {
							// Take the last known pointer down event
							const pointerDownEvent = LAST_POINTER_DOWN_EVENT_FOR_POINTER_ID.get(pointerId);
							if (pointerDownEvent == null) return;

							const diffX = clientX - pointerDownEvent.clientX;
							const absDiffX = Math.abs(diffX);
							const diffY = clientY - pointerDownEvent.clientY;
							const absDiffY = Math.abs(diffY);
							const isPanningX = absDiffX > PANNING_DIFFERENCE_THRESHOLD && absDiffX > absDiffY;
							const isPanningY = absDiffY > PANNING_DIFFERENCE_THRESHOLD && absDiffY > absDiffX;
							const isPanningUp = diffY > 0;
							const isPanningDown = diffY < 0;
							const isPanningLeft = diffX > 0;
							const isPanningRight = diffX < 0;

							if (touchAction === "none") {
								// Prevent touchmove from performing its default behavior if horizontal or vertical movement happens and none if allowed
								if (isPanningX || isPanningY) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-y") {
								// Prevent touchmove from performing its default behavior if horizontal movement happens, but only vertical scrolling is allowed
								if (isPanningX) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-y pan-left") {
								// Prevent touchmove from performing its default behavior if right-going horizontal movement happens
								if (isPanningRight) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-y pan-right") {
								// Prevent touchmove from performing its default behavior if left-going horizontal movement happens
								if (isPanningLeft) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-up") {
								if (!isPanningUp) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-down") {
								if (!isPanningDown) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-left") {
								if (!isPanningLeft) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-right") {
								if (!isPanningRight) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-x") {
								// Prevent touchmove from performing its default behavior if vertical movement happens, but only horizontal scrolling is allowed
								if (isPanningY) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-x pan-up") {
								// Prevent touchmove from performing its default behavior if down-going vertical movement happens
								if (isPanningDown) {
									e.preventDefault();
								}
							} else if (touchAction === "pan-x pan-down") {
								// Prevent touchmove from performing its default behavior if up-going vertical movement happens
								if (isPanningUp) {
									e.preventDefault();
								}
							}
						}
					});

					break;
				}

				// If the target is not equal to the original target
				if (e.target !== e.currentTarget) {
					// If none of the touches has a pointer id that is used for capturing pointer events and binding them to the current target of the event, do nothing
					if (Array.from(e.changedTouches).some(touch => POINTER_ID_TO_CAPTURED_TARGET_MAP.has(getPointerIdFromTouch(touch)))) {
						break;
					}

					// Fire a "pointercancel" event if/when the target is no longer equal to the original target
					createPointerEventsForTouchOfTypeAndDispatch("pointercancel", e, eventTarget);
				}
			}
			break;

		case "pointerdown":
			// All "pointerdown" events must be preceded by a "pointerover" event
			// https://www.w3.org/TR/pointerevents/#the-pointerover-event
			createPointerEventsForTouchOfTypeAndDispatch("pointerover", e, eventTarget);

			// All "pointerdown" events must be preceded by a "pointerenter" event
			// https://www.w3.org/TR/pointerevents/#the-pointerover-event
			createPointerEventsForTouchOfTypeAndDispatch("pointerenter", e, eventTarget);
			break;
	}
}

/**
 * Handles whatever logic needs to follow any given kind of TouchEvent
 * @param {PointerEventType} pointerEventType
 * @param {EventTarget} eventTarget
 * @param {TouchEvent} e
 */
function handlePostPointerEventForTouch(pointerEventType: PointerEventType, eventTarget: EventTarget, e: TouchEvent): void {
	// Store a reference to the event target and event currentTarget. These may change in the meantime, but we are going to need them when cloning the event
	const target = e.target;
	const currentTarget = e.currentTarget;

	// Immediately after pointerup or pointercancel events, a user agent MUST clear any pointer capture target overrides
	// https://www.w3.org/TR/pointerevents/#implicit-release-of-pointer-capture
	if (pointerEventType === "pointerup" || pointerEventType === "pointercancel") {
		Array.from(e.changedTouches).forEach(touch => {
			const pointerId = getPointerIdFromTouch(touch);
			const match = POINTER_ID_TO_CAPTURED_TARGET_MAP.get(pointerId);
			if (match != null && isElement(match)) {
				match.releasePointerCapture(pointerId);
			}
		});
	}

	switch (pointerEventType) {
		case "pointerdown":
			// The equivalent event is "touchcancel" which won't fire when the finger leaves the element
			// or when scrolling happens. We need to enforce this behavior to follow the spec.
			// https://www.w3.org/TR/pointerevents2/#the-pointercancel-event
			if (isElement(e.currentTarget)) {
				/**
				 * We need to listen for "pointermove" events to continuously monitor and update the target
				 */
				const pointerMoveHandler = () => {};

				/**
				 * We need to make sure to unbind the handler to avoid memory leaks
				 */
				const unbindPointerMoveHandler = () => {
					eventTarget.removeEventListener("pointermove", pointerMoveHandler);

					if (POINTER_EVENTS_TO_TRACK != null) {
						POINTER_EVENTS_TO_TRACK.forEach(type => {
							eventTarget.removeEventListener(type, unbindPointerMoveHandler);
						});
					}
				};

				eventTarget.addEventListener("pointermove", pointerMoveHandler);

				let ancestorsWithScroll: IScrollAncestor[] | null = findNearestAncestorsWithScroll(e.currentTarget);
				let hasFiredScrollEvent: boolean = false;

				/**
				 * Unbind the scroll listeners to avoid memory leaks and unnecessary computations
				 */
				const unbindScrollListeners = () => {
					// Then remove all listeners for scroll events
					if (ancestorsWithScroll != null) {
						ancestorsWithScroll.forEach(({scrollElement}) => scrollElement.removeEventListener("scroll", scrollHandler));
						ancestorsWithScroll = null;
					}

					if (POINTER_EVENTS_TO_TRACK != null) {
						POINTER_EVENTS_TO_TRACK.forEach(type => {
							eventTarget.removeEventListener(type, unbindScrollListeners);
						});
					}
				};

				/**
				 * When a scroll event happens, fire a 'pointercancel' event on the element
				 */
				const scrollHandler = () => {
					if (!hasFiredScrollEvent) {
						hasFiredScrollEvent = true;

						// Re-set the target and currentTarget to the values the event had before.
						// It may have changed in the meantime
						overwriteTargetsForEvent(e, target, currentTarget);

						// Construct a new event and fire it on the EventTarget
						createPointerEventsForTouchOfTypeAndDispatch("pointercancel", e, eventTarget);
					}

					unbindScrollListeners();
				};

				// Hook up listeners for "scroll" events on all scroll ancestors
				ancestorsWithScroll.forEach(({scrollElement}) => scrollElement.addEventListener("scroll", scrollHandler));

				// Make sure to also unbind the scroll handlers on various related PointerEvents
				POINTER_EVENTS_TO_TRACK.forEach(pointerEventToTrack => {
					eventTarget.addEventListener(pointerEventToTrack, unbindScrollListeners);
					eventTarget.addEventListener(pointerEventToTrack, unbindPointerMoveHandler);
				});
			}
			break;

		case "pointercancel":
			// If we're having to do with a 'pointercancel' event,
			// The spec requires a "pointerout" and "pointerleave" event to be fired immediately after.
			// https://www.w3.org/TR/pointerevents2/#the-pointercancel-event
			createPointerEventsForTouchOfTypeAndDispatch("pointerout", e, eventTarget);
			createPointerEventsForTouchOfTypeAndDispatch("pointerleave", e, eventTarget);
			break;
	}
}

/**
 * Handles touch-action values for an event
 * @param {PointerEventType} _type
 * @param {PointerEvent} e
 */
function handleTouchAction(_type: PointerEventType, e: TouchEvent): void {
	// Only consider pointerdown events here
	if (!isElement(e.currentTarget)) return;

	const touchActionAncestors = findNearestAncestorsWithTouchAction(e.currentTarget);
	const hasTouchActionNoneAncestor = touchActionAncestors.some(ancestor => ancestor.touchAction.has("none"));
	const hasPanXAncestor = touchActionAncestors.some(ancestor => ancestor.touchAction.has("pan-x"));
	const hasPanYAncestor = touchActionAncestors.some(ancestor => ancestor.touchAction.has("pan-y"));
	const hasPanUpAncestor = touchActionAncestors.some(ancestor => ancestor.touchAction.has("pan-up"));
	const hasPanDownAncestor = touchActionAncestors.some(ancestor => ancestor.touchAction.has("pan-down"));
	const hasPanLeftAncestor = touchActionAncestors.some(ancestor => ancestor.touchAction.has("pan-left"));
	const hasPanRightAncestor = touchActionAncestors.some(ancestor => ancestor.touchAction.has("pan-right"));

	const canPanX = hasTouchActionNoneAncestor || hasPanXAncestor || (hasPanLeftAncestor && hasPanRightAncestor);
	const canPanY = hasTouchActionNoneAncestor || hasPanYAncestor || (hasPanUpAncestor && hasPanDownAncestor);

	if (canPanX && canPanY) {
		Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {value: "none"});
	} else if (canPanX) {
		if (hasPanUpAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-x pan-up"
			});
		} else if (hasPanDownAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-x pan-down"
			});
		} else {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {value: "pan-x"});
		}
	} else if (canPanY) {
		if (hasPanLeftAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-y pan-left"
			});
		} else if (hasPanRightAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-y pan-right"
			});
		} else {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {value: "pan-y"});
		}
	} else if (hasPanUpAncestor) {
		if (hasPanLeftAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-up pan-left"
			});
		} else if (hasPanRightAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-up pan-right"
			});
		}
	} else if (hasPanDownAncestor) {
		if (hasPanLeftAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-down pan-left"
			});
		} else if (hasPanRightAncestor) {
			Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
				value: "pan-down pan-right"
			});
		}
	} else if (hasPanLeftAncestor) {
		Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {value: "pan-left"});
	} else if (hasPanRightAncestor) {
		Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {
			value: "pan-right"
		});
	} else if (hasPanUpAncestor) {
		Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {value: "pan-up"});
	} else if (hasPanDownAncestor) {
		Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {value: "pan-down"});
	} else {
		Object.defineProperty(e, TOUCH_ACTION_PROPERTY_NAME, {value: "auto"});
	}
}

/**
 * Creates a PointerEvent based on a TouchEvent of the given type
 * @param {PointerEventType} type
 * @param {TouchEvent} e
 * @returns {PointerEvent[]}
 */
function createPointerEventsForTouchOfType(type: PointerEventType, e: TouchEvent): PointerEvent[] {
	handleTouchAction(type, e);
	return <PointerEvent[]>Array.from(e.changedTouches)
		.map(currentTouch => {
			// For Touch, each active pointer corresponds to a finger in direct contact with the digitizer
			// https://www.w3.org/TR/pointerevents/#pointerevent-interface
			const pointerId = getPointerIdFromTouch(currentTouch);

			const initOptions: IPointerEventInitRequired = {
				...(<MouseEventInit>e),
				pointerId,
				pointerType: "touch",

				// The Touch will be primary if it is the first touch of the list
				// https://www.w3.org/TR/pointerevents/#pointerevent-interface
				isPrimary: currentTouch === e.changedTouches[0],

				bubbles: canBubble(type, e),
				cancelable: isCancelable(type, e)
			};

			// Prevent the event if cancel has been fired and it isn't an event that will always be fired after pointercancel events
			const shouldPreventBecauseCanceled = type !== "pointerout" && type !== "pointerleave" && pointerIdToCancelFiredSet.has(pointerId);

			if (shouldPreventBecauseCanceled) {
				if (e.cancelable && !e.defaultPrevented) {
					e.preventDefault();
				}
				// Update the Set since this won't be invoked otherwise
				updatePointerIdToCancelFiredSet({type, pointerId});
				return null;
			}

			// Define all properties of MouseEvents that should be set on the event object
			// noinspection JSDeprecatedSymbols
			const overwrittenMouseEventProperties: {[Key in RequiredOverwrittenMouseEventProperties]: PropertyDescriptor} & {[Key in OptionalOverwrittenMouseEventProperties]?: PropertyDescriptor} = {
				scoped: {
					value: (<any>e).scoped,
					...SHARED_DESCRIPTOR_OPTIONS
				},

				// The 'fromElement' property should be set to 'null' for interoperability reasons according to the spec
				// https://www.w3.org/TR/pointerevents/#pointerevent-interface
				fromElement: {
					value: null,
					...SHARED_DESCRIPTOR_OPTIONS
				},

				// The 'toElement' property should be set to 'null' for interoperability reasons according to the spec
				// https://www.w3.org/TR/pointerevents/#pointerevent-interface
				toElement: {
					value: null,
					...SHARED_DESCRIPTOR_OPTIONS
				},

				// The 'detail' property should always have a value of 0
				// https://www.w3.org/TR/pointerevents/#attributes-and-default-actions
				detail: {
					value: 0,
					...SHARED_DESCRIPTOR_OPTIONS
				},

				// The 'composed' property should always have a value of true
				// https://www.w3.org/TR/pointerevents/#attributes-and-default-actions
				composed: {
					value: true,
					...SHARED_DESCRIPTOR_OPTIONS
				},

				composedPath: {
					value: () => getEventPath(e.target as Element),
					...SHARED_DESCRIPTOR_OPTIONS
				},

				...(!("region" in Touch.prototype)
					? {}
					: {
							region: {
								value: (<any>currentTouch).region,
								...SHARED_DESCRIPTOR_OPTIONS
							}
					  }),

				...(!("path" in Event.prototype) || !isElement(currentTouch.target)
					? {}
					: {
							path: {
								value: getEventPath(currentTouch.target),
								...SHARED_DESCRIPTOR_OPTIONS
							}
					  }),

				...(!("deepPath" in Event.prototype) || !isElement(currentTouch.target)
					? {}
					: {
							path: {
								value: () => getEventPath(currentTouch.target as Element),
								...SHARED_DESCRIPTOR_OPTIONS
							}
					  })
			};

			// Create a new PointerEvent
			const clonedEvent = cloneEventAsPointerEvent({
				e,
				type,
				initOptions,
				overwrittenMouseEventProperties,
				dynamicPropertiesHandler: () => handleDynamicPropertiesForPointerEventOnTouch(pointerId, type, currentTouch, e)
			});
			overwriteTargetsForEvent(e, clonedEvent.target, clonedEvent.currentTarget, clonedEvent.relatedTarget);

			// Store a reference to the last constructed "pointerdown" event
			if (type === "pointerdown") {
				LAST_POINTER_DOWN_EVENT_FOR_POINTER_ID.set(pointerId, clonedEvent);
			}
			return clonedEvent;
		})
		.filter(ev => ev != null);
}

/**
 * Creates a PointerEvent based on a TouchEvent of the given type and invokes the listener with it
 * @param {PointerEventType} type
 * @param {TouchEvent} e
 * @param {EventTarget} eventTarget
 * @param {EventListenerOrEventListenerObject} listener
 */
function createPointerEventsForTouchOfTypeAndInvoke(type: PointerEventType, e: TouchEvent, eventTarget: EventTarget, listener: EventListenerOrEventListenerObject): void {
	const pointerEvents = createPointerEventsForTouchOfType(type, e);
	// Handle whatever needs to come before the TouchEvent
	handlePrePointerEventForTouch(type, eventTarget, e, pointerEvents);

	pointerEvents.forEach(clone => {
		updatePointerIdToCancelFiredSet(clone);
		// Invoke the listener with the cloned event
		invokeListener(clone, listener);
	});

	// Handle whatever needs to come after the TouchEvent
	handlePostPointerEventForTouch(type, eventTarget, e);
}

/**
 * Creates a PointerEvent based on a TouchEvent of the given type and dispatches an event on the event target
 * @param {PointerEventType} type
 * @param {TouchEvent} e
 * @param {EventTarget} eventTarget
 */
export function createPointerEventsForTouchOfTypeAndDispatch(type: PointerEventType, e: TouchEvent, eventTarget: EventTarget): void {
	const pointerEvents = createPointerEventsForTouchOfType(type, e);
	// Handle whatever needs to come before the TouchEvent
	handlePrePointerEventForTouch(type, eventTarget, e, pointerEvents);

	pointerEvents.forEach(clone => {
		updatePointerIdToCancelFiredSet(clone);

		// Dispatch the event on the target
		eventTarget.dispatchEvent(clone);
	});

	// Handle whatever needs to come after the TouchEvent
	handlePostPointerEventForTouch(type, eventTarget, e);
}

/**
 * Handles a PointerEvent for a Touch device
 * @param {EventTarget} eventTarget
 * @param {PointerEventType} type
 * @param {TouchEvent} e
 * @param {EventListenerOrEventListenerObject} listener
 */
export function handlePointerEventForTouch(eventTarget: EventTarget, type: PointerEventType, e: TouchEvent, listener: EventListenerOrEventListenerObject): void {
	createPointerEventsForTouchOfTypeAndInvoke(type, e, eventTarget, listener);
}
