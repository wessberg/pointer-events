export interface IPointerEventBase {
	readonly pointerId: number;
	readonly width: number;
	readonly height: number;
	readonly pressure: number;
	readonly tangentialPressure: number;
	readonly tiltX: number;
	readonly tiltY: number;
	readonly twist: number;
	readonly pointerType: ""|"mouse"|"pen"|"touch";
	readonly isPrimary: boolean;
}