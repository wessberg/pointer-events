export interface IPointerEventInitRequired extends MouseEventInit {
	pointerId: number;
	pointerType: "mouse" | "touch" | "pen";
	isPrimary: boolean;
	cancelable: boolean;
	bubbles: boolean;
}
