// tslint:disable:no-any

import {SUPPORTS_POINTER_EVENT_HANDLERS} from "./global-event-handlers-check";

// Only patch the dispatchEvent EventTarget prototype method if the user agent
// doesn't already support Global Event Handlers for Pointer Events
if (!SUPPORTS_POINTER_EVENT_HANDLERS) {
	// Add EventHandlers such that "in" checks return true
	(<any>EventTarget).prototype.ongotpointercapture = null;
	(<any>EventTarget).prototype.onlostpointercapture = null;
	(<any>EventTarget).prototype.onpointerdown = null;
	(<any>EventTarget).prototype.onpointermove = null;
	(<any>EventTarget).prototype.onpointerup = null;
	(<any>EventTarget).prototype.onpointercancel = null;
	(<any>EventTarget).prototype.onpointerover = null;
	(<any>EventTarget).prototype.onpointerout = null;
	(<any>EventTarget).prototype.onpointerenter = null;
	(<any>EventTarget).prototype.onpointerleave = null;
}