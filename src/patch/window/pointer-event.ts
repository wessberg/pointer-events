import {PointerEvent} from "../../pointer-event";
import {SUPPORTS_POINTER_EVENTS} from "./pointer-event-check";

// tslint:disable:no-any

// Only patch the window object if it doesn't already have a PointerEvent constructor
if (!SUPPORTS_POINTER_EVENTS) {
	// Set the PointerEvent reference on the window object
	(<any>window).PointerEvent = PointerEvent;
}