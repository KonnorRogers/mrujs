---
title: (Experimental) QuerySelectors
permalink: /references/query-selectors
---

mrujs comes with a number of preconstructed querySelectors. These can be
extended with the following API:

```js
import mrujs from "mrujs"

// Append it to a known querySelector
window.mrujs.linkDisableSelector += ", my-anchor"

// Now start!
mrujs.start()
```

Important to note, you must set these before starting mrujs or in the
"initialize" callback of a plugin.

If you want to set the querySelectors mid-session, you will have to
follow the above steps, but instead of calling `start`, you would call `mrujs.restart()`.

A list of all `querySelectors` and their strings can be found in the
[src/utils/dom.ts](https://github.com/ParamagicDev/mrujs/blob/main/src/utils/dom.ts) file.

