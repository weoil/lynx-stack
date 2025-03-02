# Project Web Platform

## About the Web Platform

The Lynx's Web Platform is an implementation for Lynx's native binding APIs based on Browser APIs.

We're working on providing the high performance solutation, same appearance and same behaviors for the same Lynx project in Browsers, Android and iOS.

## The differences of Lynx on the Android/iOS and the Web

The Web Platform uses the Browser's CSS engine, layout engine and rendering engine to provide the rendering pipeline and pixeling pipeline.

It uses the Browser's JavaScript engine to provide the JavaScript executing context.

For the layout and the CSS features, most of them have the same behaviors and concepts with W3C/WHATWG standards.
Some features, like the `Linear Layout`, we provided an implementation based on the Browser's JS and CSS.
We'll make our best efforts to provide those features in browsers.

For the pixeling pipeline, since we're using the DOM APIs to render by the browser, we don't have a plan to adapt to the Lynx's implementation on Android or iOS.
The pixeling and rendering pipelines are considered as the internal implementation for Native-binding APIs.

As for the UI elements, the iOS, Android, and the web have different native element implementations on each platform.
In the Browser, we have a set of custom elements to serve such features.

## The shared part

Basically, the JavaScript & CSS code is shared. This includes your Lynx code, the ReactLynx's runtime code and those Lynx's APIs implemented by JavaScript.

You may notice that the output file for the Web Platform is not the same as the file for Lynx Android/iOS.
The reason is we provide an AOT optimization(aka the 'encode') for Lynx Android&iOS since on those platforms the JavaScript's JIT is not available.
The source information is exactly the same on these two Lynx implementation.

For the JavaScript engine, the Lynx's JavaScript engine follows the ECMAScript standards.

## Browser Compatibility

The Web Platform is developed based on the latest chromium, firefox and safari.
We provide a progressive backwards compatibility for previous version of browsers.
A polyfill tool may be required to run the project.
Here we provide some modern Web APIs we're using.

- ECMAScript Features
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
- DOM Features
  - https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
  - https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
  - https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
  - https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- CSS Features
  - https://developer.mozilla.org/en-US/docs/Web/CSS/--*
  - https://developer.mozilla.org/en-US/docs/Web/CSS/::part
- x-blur-view
  - https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- x-swiper, x-viewpager-ng
  - https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-stop
- lynx-wrapper
  - https://developer.mozilla.org/en-US/docs/Web/CSS/display#browser_compatibility
- x-overlay-ng
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
