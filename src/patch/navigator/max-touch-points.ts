import {isTouchDevice} from "../../is-touch-device";
import {SUPPORTS_MAX_TOUCH_POINTS} from "./max-touch-points-check";

// tslint:disable:no-any

// Only set the 'maxTouchPoints' property on the Navigator prototype if it isn't already supported
if (!SUPPORTS_MAX_TOUCH_POINTS) {
	// If the device is a touch device, use 1 as the max available touch points even if it may be more. We have no way of knowing! Otherwise, fall back to 0
	Object.defineProperty(Navigator.prototype, "maxTouchPoints", {
		value:
			"maxTouchPoints" in navigator
				? // Use the existing maxTouchPoints value if given
				  navigator.maxTouchPoints
				: // Use the existing msMaxTouchPoints value if given
				"msMaxTouchPoints" in navigator
				? (<any>navigator).msMaxTouchPoints
				: !isTouchDevice
				? 0
				: 1,
		enumerable: true
	});
}
