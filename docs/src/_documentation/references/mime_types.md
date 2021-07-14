---
title: (Experimental) MimeTypes
doc_order: 80
---

mrujs comes with a set of predefined MimeTypes for `AcceptHeaders`.
These can be modified to include additional shortcuts.

Here is an example of adding a custom CableCar mimetype.

```js
import mrujs from "mrujs"

mrujs.registerMimeTypes(
  [
    {shortcut: "cablecar", header: "text/vnd.cablecar.json"}
  ]
)

mrujs.start()
```

Then in a form you can do the following to set the proper Accept header
with shorthand syntax.

```html
<form data-remote="true" data-type="cablecar"></form>
```

and this will set the Accept header to `"text/vnd.cablecar.json"`

### [Overriding the default MimeType](#overriding-the-default-mimetype)

By default, mrujs will use the `mrujs.mimeTypes.any` which is `"*/*"`
for remote forms + links.

If you would like to override this, you can do so with the following
syntax:

```js
mrujs.registerMimeTypes(
  [
    {shortcut: "any", header: "text/vnd.my-custom-header, */*"}
  ]
)
```

Now, `"text/vnd.my-custom-header"` will take precendence over other
responses.

