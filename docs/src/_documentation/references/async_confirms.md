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
<button
   data-async-confirm="Are you sure?"
   data-async-confirm-text="Yes, I'm sure!"
   data-async-cancel-text="No! I'm not sure...">
  Do stuff
</button>

const btn = document.querySelector("button")
btn.addEventListener("confirm:complete", (event) => console.log(event.detail.answer))
```

<p align="middle">
  Check the console!

  <br>

  <button id="example-button" class="btn btn--primary"
          data-async-confirm="Are you sure?"
          data-async-confirm-text="Yes, I'm sure!"
          data-async-cancel-text="No! I'm not sure...">
    Do stuff
  </button>
</p>

<script>
  const btn = document.querySelector("#example-button")
  btn.addEventListener("confirm:complete", (event) => console.log(event.detail.answer))
</script>
