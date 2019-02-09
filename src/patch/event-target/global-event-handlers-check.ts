import {POINTER_EVENT_TYPES} from "../../pointer-event-type";

/**
 * Checks if there are Global Event Handlers (such as 'onpointerdown') for every Pointer Event
 * @type {boolean}
 */
export const SUPPORTS_POINTER_EVENT_HANDLERS = POINTER_EVENT_TYPES.every(type => `on${type}` in window);
