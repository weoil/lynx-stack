---
"@lynx-js/web-elements": patch
---

fix: Removed the list-item style `contain: strict`. Previously we thought it would affect `content-visibility: auto`, but it turns out that this is wrong.

Now, you don't need to specify the width and height of list-item, it will be stretched by the child elements.
