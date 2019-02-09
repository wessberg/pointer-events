import {PointerEventInit} from "./pointer-event-init";
import {PointerEventType} from "./pointer-event-type";
import {PointerEvent} from "./pointer-event";
import {OptionalOverwrittenMouseEventProperties, RequiredOverwrittenMouseEventProperties} from "./overwritten-mouse-event-properties";
import {DynamicPointerEventProperty} from "./dynamic-pointer-event-property";
import {CLONEABLE_UI_EVENT_PROPERTIES} from "./cloneable-ui-event-properties";
import {SHARED_DESCRIPTOR_OPTIONS} from "./shared-descriptor-options";

// tslint:disable:no-any

export interface ICloneEventAsPointerEventOptions {
	e: MouseEvent | TouchEvent;
	initOptions: Partial<PointerEventInit>;
	type: PointerEventType;
	overwrittenMouseEventProperties: {[Key in RequiredOverwrittenMouseEventProperties]: PropertyDescriptor} & {[Key in OptionalOverwrittenMouseEventProperties]?: PropertyDescriptor};
	dynamicPropertiesHandler(): {[Key in DynamicPointerEventProperty]?: PropertyDescriptor};
}

/**
 * Clones an Event as a new PointerEvent
 * @param {ICloneEventAsPointerEventOptions} options
 * @returns {PointerEvent}
 */
export function cloneEventAsPointerEvent({dynamicPropertiesHandler, e, initOptions, overwrittenMouseEventProperties, type}: ICloneEventAsPointerEventOptions): PointerEvent {
	// Create a new PointerEvent
	const clone = new PointerEvent(type, initOptions);

	// Preventing default on the clone will also prevent default on the original event
	const rawPreventDefault = clone.preventDefault;
	const rawStopPropagation = clone.stopPropagation;
	const rawStopImmediatePropagation = clone.stopImmediatePropagation;

	clone.preventDefault = function() {
		rawPreventDefault.call(this);
		if (!e.defaultPrevented) {
			e.preventDefault();
		}
	};

	// Stopping propagation on the clone will also stop propagation on the original event
	clone.stopPropagation = function() {
		rawStopPropagation.call(this);
		e.stopPropagation();
	};

	// Stopping immediate propagation on the clone will also stop immediate propagation on the original event
	clone.stopImmediatePropagation = function() {
		rawStopImmediatePropagation.call(this);
		e.stopImmediatePropagation();
	};

	let additionalPropsToSet: PropertyDescriptorMap = {};
	CLONEABLE_UI_EVENT_PROPERTIES.forEach(
		key =>
			(additionalPropsToSet[key] = {
				value: e[key],
				...SHARED_DESCRIPTOR_OPTIONS
			})
	);

	additionalPropsToSet = {
		...additionalPropsToSet,
		...(<PropertyDescriptorMap>overwrittenMouseEventProperties),
		// Handle all dynamic properties based on the type of PointerEvent
		...(<PropertyDescriptorMap>dynamicPropertiesHandler())
	};

	// Set MouseEvent (and inherited UIEvent) properties on the event object
	Object.defineProperties(clone, additionalPropsToSet);
	return clone;
}
