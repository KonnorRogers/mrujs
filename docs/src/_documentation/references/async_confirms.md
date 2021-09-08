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
import { AsyncConfirm } from "mrujs"

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
<a href="/logout" data-method="delete" data-async-confirm="Are you sure?">
  Log out
</a>
```

There are some issues around I18n which will need to be addressed with
this component.
