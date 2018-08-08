import {SHARED_DESCRIPTOR_OPTIONS} from "./shared-descriptor-options";

/**
 * Overwrites the targets for the given event
 * @param {Event} e
 * @param {EventTarget | undefined} target
 * @param {EventTarget | undefined} currentTarget
 * @param {EventTarget | undefined} relatedTarget
 */
export function overwriteTargetsForEvent (e: Event, target?: EventTarget|undefined|null, currentTarget?: EventTarget|undefined|null, relatedTarget?: EventTarget|undefined|null): void {
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