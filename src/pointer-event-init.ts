// tslint:disable:interface-name

export interface PointerEventInit extends MouseEventInit {
	pointerId: number;
	width: number;
	height: number;
	pressure: number;
	tangentialPressure: number;
	tiltX: number;
	tiltY: number;
	twist: number;
	pointerType: ""|"mouse"|"touch"|"pen";
	isPrimary: boolean;
}