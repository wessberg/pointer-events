<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/pointer-events/master/documentation/asset/logo.png" height="250"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A Level 2 spec-compliant Pointer Events polyfill with first-class Shadow DOM support

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/%40wessberg%2Fpointer-events?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fpointer-events.svg"    /></a>
<a href="https://www.npmjs.com/package/%40wessberg%2Fpointer-events"><img alt="NPM version" src="https://badge.fury.io/js/%40wessberg%2Fpointer-events.svg"    /></a>
<a href="https://david-dm.org/wessberg/pointer-events"><img alt="Dependencies" src="https://img.shields.io/david/wessberg%2Fpointer-events.svg"    /></a>
<a href="https://github.com/wessberg/pointer-events/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fpointer-events.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

This polyfill brings Level 2 [Pointer Events](https://www.w3.org/TR/pointerevents/) to all browsers!
The Pointer Events specification provides a unified model for handling input from a _pointer_ such as a mouse, a touch, and a pen.

Gone are the complexities of handling both `MouseEvent`s and `TouchEvent`s and juggling the differences between them.
The primary design goals of this polyfill are to be as spec-compliant as possible, and to support modern web technologies such as Shadow DOM.

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- Spec-compliant
- Shadow DOM support
- Performant
- Feature-complete

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
  - [Features](#features)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [NPM](#npm)
  - [Yarn](#yarn)
- [Usage](#usage)
  - [`touch-action` support](#touch-action-support)
- [Dependencies & Browser support](#dependencies--browser-support)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [Backers](#backers)
  - [Patreon](#patreon)
- [FAQ](#faq)
  - [There are several polyfills for Pointer events already. Why another one?](#there-are-several-polyfills-for-pointer-events-already-why-another-one)
  - [Are there any known quirks?](#are-there-any-known-quirks)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### NPM

```
$ npm install @wessberg/pointer-events
```

### Yarn

```
$ yarn add @wessberg/pointer-events
```

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

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

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

## Maintainers

| <img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="70"   />                   |
| --------------------------------------------------------------------------------------------------------------------------------- |
| [Frederik Wessberg](mailto:frederikwessberg@hotmail.com)<br>[@FredWessberg](https://twitter.com/FredWessberg)<br>_Lead Developer_ |

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

### Patreon

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, avatar, and Twitter handle listed here.

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Backers on Patreon" src="https://patreon-badge.herokuapp.com/11315442.png"  width="500"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

## FAQ

<!-- SHADOW_SECTION_FAQ_END -->

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

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->
