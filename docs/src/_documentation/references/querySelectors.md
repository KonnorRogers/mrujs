---
title: (Experimental) QuerySelectors
doc_order: 80
---

mrujs comes with a number of preconstructed querySelectors. These can be
extended with the following API:

```js
import mrujs from "mrujs"

// Save the original
const originalSelectors = mrujs.querySelectors

// Modify it.
originalSelectors.linkDisableSelector.selector += ", my-custom-element"

// Push it back in.
mrujs.querySelectors = originalSelectors

// Now start!
mrujs.start()
```

Important to note, you must set these before starting mrujs.
If you want to set the querySelectors mid-session, you will have to
follow the above steps, but instead of calling `start`, you would call `mrujs.restart()`.

A list of all `querySelectors` and their strings can be found in the
[src/utils/dom.ts](https://github.com/ParamagicDev/mrujs/blob/main/src/utils/dom.ts) file.

