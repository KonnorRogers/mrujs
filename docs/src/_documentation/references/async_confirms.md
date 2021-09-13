---
title: (Experimental) Async Confirm Dialogs
doc_order: 120
---

Mrujs offers an alternative to `window.confirm()` dialogs in the form of
`data-async-confirm="<text>"` which will display a modal which will not block the
main thread.

To use it, do the following:

```js
import mrujs from "mrujs"
import { AsyncConfirm } from "mrujs/plugins"

mrujs.start({
  plugins: [
    AsyncConfirm()
  ]
})
```

This is currently implemented via a Web Component and is considered
experimental until the API is improved and iterated upon.

Example:

```html
<button data-method="delete"
   data-async-confirm="Are you sure?"
   data-async-confirm-text="Yes, Logout!"
   data-async-cancel-text="Absolutely not!">
  Log out
</button>
```

<button data-method="delete"
   data-async-confirm="Are you sure?"
   data-async-confirm-ok="Yes, Logout!"
   data-async-confirm-cancel="No! Absolutely not!">
  Log out
</button>
