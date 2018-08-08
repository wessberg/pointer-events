import {IPointerEventBase} from "./i-pointer-event-base";
import {POINTER_EVENT_DEFAULT_VALUES} from "./pointer-event-default-values";
import {SHARED_DESCRIPTOR_OPTIONS} from "./shared-descriptor-options";

/**
 * Gets a PropertyDescriptor with a fallback value
 * @param {Key} key
 * @param {IPointerEventBase[Key]} providedValue
 * @returns {PropertyDescriptor}
 */
export function getDescriptorWithFallback<Key extends keyof IPointerEventBase> (key: Key, providedValue?: IPointerEventBase[Key]): PropertyDescriptor {
	return {
		value: providedValue != null ? providedValue : POINTER_EVENT_DEFAULT_VALUES[key], ...SHARED_DESCRIPTOR_OPTIONS
	};
}