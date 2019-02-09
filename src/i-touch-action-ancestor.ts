export declare type TouchAction = "auto" | "none" | "pan-x" | "pan-y" | "manipulation" | "pan-left" | "pan-right" | "pan-up" | "pan-down";

export interface ITouchActionAncestor {
	touchAction: Set<TouchAction>;
	element: Element | Window;
}
