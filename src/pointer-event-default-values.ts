import {IPointerEventBase} from "./i-pointer-event-base";

/**
 * The default values for constructed PointerEvents
 * @type {object}
 */
export const POINTER_EVENT_DEFAULT_VALUES: {[Key in keyof IPointerEventBase]: IPointerEventBase[Key]} = {
	pointerId: 0,
	width: 1,
	height: 1,
	pressure: 0,
	tangentialPressure: 0,
	tiltX: 0,
	tiltY: 0,
	twist: 0,
	pointerType: "",
	isPrimary: false
};
