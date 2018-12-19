import {SHARED_DESCRIPTOR_OPTIONS} from "./shared-descriptor-options";

type NullableEventTarget = EventTarget|undefined|null;

/**
 * Overwrites the targets for the given event
 * @param {Event} e
 * @param {NullableEventTarget} target
 * @param {NullableEventTarget} currentTarget
 * @param {NullableEventTarget} relatedTarget
 */
export function overwriteTargetsForEvent (e: Event, target?: NullableEventTarget, currentTarget?: NullableEventTarget, relatedTarget?: NullableEventTarget): void {
	// Set the original target and currentTarget on the cancel event
	Object.defineProperties(e, {
		...(target === undefined ? {} : {
			target: {
				value: target, ...SHARED_DESCRIPTOR_OPTIONS
			}
		}),
		...(currentTarget === undefined ? {} : {
			currentTarget: {
				value: currentTarget, ...SHARED_DESCRIPTOR_OPTIONS
			}
		}),
		...(relatedTarget === undefined ? {} : {
			relatedTarget: {
				value: relatedTarget, ...SHARED_DESCRIPTOR_OPTIONS
			}
		})
	});
}