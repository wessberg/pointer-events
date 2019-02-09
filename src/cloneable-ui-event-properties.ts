import {CLONEABLE_EVENT_PROPERTIES} from "./cloneable-event-properties";

export const CLONEABLE_UI_EVENT_PROPERTIES: Set<keyof UIEvent> = new Set(<(keyof UIEvent)[]>[
	...CLONEABLE_EVENT_PROPERTIES,
	"view",
	...("sourceCapabilities" in UIEvent.prototype ? ["sourceCapabilities"] : [])
]);
