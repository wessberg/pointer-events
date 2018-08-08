// tslint:disable:no-any
let hasPointerLock: boolean = false;
export const HAS_POINTER_LOCK = () => hasPointerLock;

/**
 * Invoked when a "pointerlockchange" event is fired. Is used to
 * update the value of 'hasPointerLock'
 */
const handler = () => {
	hasPointerLock = document.pointerLockElement != null && (<any>document).mozPointerLockElement != null;
};

// Listen for PointerLock events
document.addEventListener("pointerlockchange", handler);
document.addEventListener("mozpointerlockchange", handler);