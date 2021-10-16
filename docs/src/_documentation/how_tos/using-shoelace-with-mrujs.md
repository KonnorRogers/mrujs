---
title: Using Shoelace with Mrujs
doc_order: 70
---

Mrujs ships with a Shoelace plugin. Currently this plugin is fairly minimal. At its
core, the plugin listens for all Shoelace submit events, will grab the Shoelace form,
check for a `action` and `method` on the Shoelace form. (These are currently non-standard
attributes on Shoelace forms)

it will then submit this form via AJAX and go through the normal `ajax:` lifecycle within
mrujs.

Example:

```html
<sl-form action="/url" method="post">
</sl-form>
```

<h2 id="usage">
  <a href="#usage">
    Usage
  </a>
</h2>

```js
import mrujs from "mrujs"
import { Shoelace } from "mrujs/plugins"

mrujs.start({
  plugins: [
    Shoelace()
  ]
})
```


