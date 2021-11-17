---
title: (Removed) Async Confirm Dialogs
permalink: /references/async-confirms
---

<%= render(Alert.new(title: "Warning:", type: :warning)) do %>
  <p>
    Async confirms in their current state are deprecated until a more
    stable API is put into place.
  </p>
<% end %>

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
    data-async-confirm-ok="Yes, I'm sure!"
    data-async-confirm-cancel="No! I'm not sure...">
  Do stuff
</button>

<script>
  const btn = document.querySelector("button")
  btn.addEventListener("confirm:complete", (event) => console.log(event.detail.answer))
</script>
```

<p align="middle">
  Check the console!

  <br>

  <button id="example-button" class="btn btn--primary"
          data-async-confirm="Are you sure?"
          data-async-confirm-ok="Yes, I'm sure!"
          data-async-confirm-cancel="No! I'm not sure...">
    Do stuff
  </button>
</p>

<script>
  const btn = document.querySelector("#example-button")
  btn.addEventListener("confirm:complete", (event) => console.log(event.detail.answer))
</script
