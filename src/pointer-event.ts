import {PointerEventInit} from "./pointer-event-init";
import {IPointerEventBase} from "./i-pointer-event-base";
import {PointerEventType} from "./pointer-event-type";
import {getDescriptorWithFallback} from "./get-descriptor-with-fallback";
import {SEEN_POINTER_IDS} from "./seen-pointer-ids";

// tslint:disable:no-any
/**
 * A specialization of MouseEvents as spec'ed in https://www.w3.org/TR/pointerevents
 */
export class PointerEvent implements IPointerEventBase, MouseEvent {
	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-pointerid
	 * @type {number}
	 */
	public readonly pointerId: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-width
	 * @type {number}
	 */
	public readonly width: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-height
	 * @type {number}
	 */
	public readonly height: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-pressure
	 * @type {number}
	 */
	public readonly pressure: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-tangentialpressure
	 * @type {number}
	 */
	public readonly tangentialPressure: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-tiltx
	 * @type {number}
	 */
	public readonly tiltX: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-tilty
	 * @type {number}
	 */
	public readonly tiltY: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-twist
	 * @type {number}
	 */
	public readonly twist: number;

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-pointertype
	 * @type {number}
	 */
	public readonly pointerType: ""|"mouse"|"pen"|"touch";

	/**
	 * See https://www.w3.org/TR/pointerevents/#dom-pointerevent-isprimary
	 * @type {number}
	 */
	public readonly isPrimary: boolean;

	/**
	 * Overwrites the event type
	 * @override
	 */
	public readonly type: PointerEventType;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly AT_TARGET: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly BUBBLING_PHASE: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly CAPTURING_PHASE: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly NONE: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly altKey: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly bubbles: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly button: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly buttons: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public cancelBubble: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly cancelable: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly clientX: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly clientY: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly composed: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly ctrlKey: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {EventTarget|null}
	 */
	public readonly currentTarget: EventTarget|null;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly defaultPrevented: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly detail: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly eventPhase: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {Element}
	 */
	public readonly fromElement: Element;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly isTrusted: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly layerX: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly layerY: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly metaKey: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {movementX}
	 */
	public readonly movementX: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {movementY}
	 */
	public readonly movementY: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {offsetX}
	 */
	public readonly offsetX: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {offsetY}
	 */
	public readonly offsetY: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly pageX: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly pageY: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {EventTarget}
	 */
	public readonly relatedTarget: EventTarget;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public returnValue: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly screenX: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly screenY: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {boolean}
	 */
	public readonly shiftKey: boolean;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {Element|null}
	 */
	public readonly srcElement: Element|null;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {EventTarget|null}
	 */
	public readonly target: EventTarget|null;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly timeStamp: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {Element}
	 */
	public readonly toElement: Element;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {Window}
	 */
	public readonly view: Window;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly which: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly x: number;

	/**
	 * Uses the underlying MouseEvent implementation
	 * @type {number}
	 */
	public readonly y: number;

	constructor (type: PointerEventType, eventInitDict: Partial<PointerEventInit> = {}) {

		// Sets all of the given PropertyDescriptors with fallbacks to the default values as defined by the specification
		const propsToSet: { [Key in keyof IPointerEventBase]?: PropertyDescriptor } = {
			pointerId: getDescriptorWithFallback("pointerId", eventInitDict.pointerId),
			width: getDescriptorWithFallback("width", eventInitDict.width),
			height: getDescriptorWithFallback("height", eventInitDict.height),
			pressure: getDescriptorWithFallback("pressure", eventInitDict.pressure),
			tangentialPressure: getDescriptorWithFallback("tangentialPressure", eventInitDict.tangentialPressure),
			tiltX: getDescriptorWithFallback("tiltX", eventInitDict.tiltX),
			tiltY: getDescriptorWithFallback("tiltY", eventInitDict.tiltY),
			twist: getDescriptorWithFallback("twist", eventInitDict.twist),
			pointerType: getDescriptorWithFallback("pointerType", eventInitDict.pointerType),
			isPrimary: getDescriptorWithFallback("isPrimary", eventInitDict.isPrimary)
		};

		const mouseEvent = new MouseEvent(type, eventInitDict);
		Object.defineProperties(mouseEvent, <PropertyDescriptorMap> propsToSet);

		// Update the SEEN_POINTER_IDS Set with the pointer id from the options
		SEEN_POINTER_IDS.add(propsToSet.pointerId!.value);

		// Return the constructed MouseEvent directly from the constructor
		return <PointerEvent><any> mouseEvent;
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 * @returns {EventTarget[]}
	 */
	public deepPath (): EventTarget[] {
		return [];
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 * @param {string} _keyArg
	 * @returns {boolean}
	 */
	public getModifierState (_keyArg: string): boolean {
		return false;
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 * @param {string} _type
	 * @param {boolean} _bubbles
	 * @param {boolean} _cancelable
	 */
	public initEvent (_type: string, _bubbles?: boolean, _cancelable?: boolean): void {
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 * @param {string} _typeArg
	 * @param {boolean} _canBubbleArg
	 * @param {boolean} _cancelableArg
	 * @param {Window} _viewArg
	 * @param {number} _detailArg
	 * @param {number} _screenXArg
	 * @param {number} _screenYArg
	 * @param {number} _clientXArg
	 * @param {number} _clientYArg
	 * @param {boolean} _ctrlKeyArg
	 * @param {boolean} _altKeyArg
	 * @param {boolean} _shiftKeyArg
	 * @param {boolean} _metaKeyArg
	 * @param {number} _buttonArg
	 * @param {EventTarget | null} _relatedTargetArg
	 */
	public initMouseEvent (_typeArg: string, _canBubbleArg: boolean, _cancelableArg: boolean, _viewArg: Window, _detailArg: number, _screenXArg: number, _screenYArg: number, _clientXArg: number, _clientYArg: number, _ctrlKeyArg: boolean, _altKeyArg: boolean, _shiftKeyArg: boolean, _metaKeyArg: boolean, _buttonArg: number, _relatedTargetArg: EventTarget|null): void {
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 * @param {string} _typeArg
	 * @param {boolean} _canBubbleArg
	 * @param {boolean} _cancelableArg
	 * @param {Window} _viewArg
	 * @param {number} _detailArg
	 */
	public initUIEvent (_typeArg: string, _canBubbleArg: boolean, _cancelableArg: boolean, _viewArg: Window, _detailArg: number): void {
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 */
	public preventDefault (): void {
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 */
	public stopImmediatePropagation (): void {
	}

	/**
	 * This is a no-op. A MouseEvent is returned from the constructor
	 */
	public stopPropagation (): void {
	}
}