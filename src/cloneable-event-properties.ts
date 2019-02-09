export const CLONEABLE_EVENT_PROPERTIES: Set<keyof Event> = new Set(<(keyof Event)[]>[
	"cancelBubble",
	"currentTarget",
	"defaultPrevented",
	"eventPhase",
	"returnValue",
	"scoped",
	"srcElement",
	"timeStamp",
	"deepPath",
	"AT_TARGET",
	"BUBBLING_PHASE",
	"CAPTURING_PHASE",
	"NONE"
]);
