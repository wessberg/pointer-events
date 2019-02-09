<a href="https://npmcharts.com/compare/@wessberg/pointer-events?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fpointer-events.svg" height="20"></img></a>
<a href="https://david-dm.org/wessberg/pointer-events"><img alt="Dependencies" src="https://img.shields.io/david/wessberg/pointer-events.svg" height="20"></img></a>
<a href="https://www.npmjs.com/package/@wessberg/pointer-events"><img alt="NPM Version" src="https://badge.fury.io/js/%40wessberg%2Fpointer-events.svg" height="20"></img></a>
<a href="https://github.com/wessberg/pointer-events/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fpointer-events.svg" height="20"></img></a>
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" height="20"></img></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="20"></img></a>

# `@wessberg/pointer-events`

> A Level 2 spec-compliant Pointer Events polyfill with first-class Shadow DOM support

## Description

This polyfill brings Level 2 [Pointer Events](https://www.w3.org/TR/pointerevents/) to all browsers!
The Pointer Events specification provides a unified model for handling input from a _pointer_ such as a mouse, a touch, and a pen.

Gone are the complexities of handling both `MouseEvent`s and `TouchEvent`s and juggling the differences between them.
The primary design goals of this polyfill are to be as spec-compliant as possible, and to support modern web technologies such as Shadow DOM.

## Install

### NPM

```
$ npm install @wessberg/pointer-events
```

### Yarn

```
$ yarn add @wessberg/pointer-events
```

## Usage

To use the Polyfill, simply import it:

```typescript
import "@wessberg/pointer-events";
```

However, it is strongly suggested that you only include the polyfill for browsers that doesn't already support Pointer Events.
One way to do so is with an async import:

```typescript
if (!("PointerEvent" in window)) {
	await import("@wessberg/pointer-events");
}
```

Alternatively, you can use [Polyfill.app](https://github.com/wessberg/Polyfiller) which uses this polyfill and takes care of only loading the polyfill if needed as well as adding the language features that the polyfill depends on (See [dependencies](#dependencies--browser-support)).

### `touch-action` support

This polyfill supports the following [Pointer Events (Level 2)](https://www.w3.org/TR/pointerevents/) `touch-action` values, as well as those
defined in the latest [Draft Community Report](https://w3c.github.io/pointerevents/extension.html#extensions-to-the-pointerevent-interface):

- `none`
- `pan-x`
- `pan-y`
- `pan-left`
- `pan-right`
- `pan-up`
- `pan-down`
- `auto`
- `manipulation` (will be treated the same ast `auto`)

Upon pointer contact, the polyfill will walk up the DOM tree from the target element and look for elements that has either:

- A style attribute including a `touch-action` property.
- An element with a `touch-action` attribute.
- Or, an element with a `CSSStyleDeclaration` with a `touchAction` property.

This means that either of the following approaches will work:

```html
<!-- Works just fine when given in the 'style' attribute -->
<div style="touch-action: pan-y"></div>
<!-- Works just fine when given as an attribute of the name 'touch-action' -->
<div touch-action="pan-y"></div>
```

```typescript
// Works jut fine when given as a style property
element.style.touchAction = "pan-y";
```

See [this section](#are-there-any-known-quirks) for information about why `touch-action` values provided in stylesheets won't be discovered by the polyfill.

## Dependencies & Browser support

This polyfill is distributed in ES3-compatible syntax, but is using some modern APIs and language features which must be available:

- `EventTarget`
- `Set`
- `Map`
- `Object.defineProperty`
- `Object.defineProperties`
- `Array.from`
- `Array.prototype.some`
- `Array.prototype.every`
- `String.prototype.includes`
- Constructable `Event`s
- `EventTarget.prototype.addEventListener`
- `EventTarget.prototype.removeEventListener`
- `EventTarget.prototype.dispatchEvent`
- `Document.prototype.elementFromPoint`
- `window.getComputedStyle`
- `ShadowRoot.prototype.elementFromPoint`\*

_\*: This is only relevant if you're using Shadow DOM (in which case a Shadow DOM polyfill will most likely polyfill the prototype method)._

For by far the most browsers, these features will already be natively available.
Generally, I would highly recommend using something like [Polyfill.app](https://github.com/wessberg/Polyfiller) which takes care of this stuff automatically.

## FAQ

### There are several polyfills for Pointer events already. Why another one?

Yes, there are several, including [PEP](https://github.com/jquery/PEP) and [Points](https://github.com/Rich-Harris/Points).
This polyfill was made because neither were built with Shadow DOM (v1) support in mind.
For example, _Points_ assumes a single document-level root and relies on `document.elementFromPoint` which will never reach within Shadow roots.
And, _PEP_ relies on _/deep/_ selectors, something that has been removed from the platform.
I found that none of the existing polyfills I attempted _"just worked"_ and decided to try it out for myself.
There may well be parts of this polyfill that is less aligned with the spec than other polyfills, and such issues will be ironed out over time.

### Are there any known quirks?

For now, just one: The `touch-action` CSS property needs to be provided from either inline styles or an attribute of the same name.
This is because [polyfilling CSS is hard and really bad for performance](https://philipwalton.com/articles/the-dark-side-of-polyfilling-css/).

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

## Maintainers

- <a href="https://github.com/wessberg"><img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="11"></img></a> [Frederik Wessberg](https://github.com/wessberg): _Maintainer_

## Backers 🏅

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, logo, and link to your site listed here.

## License 📄

MIT © [Frederik Wessberg](https://github.com/wessberg)
