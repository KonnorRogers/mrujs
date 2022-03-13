---
title: Using an alternate error renderer
permalink: /how-tos/use-an-alternate-error-renderer
---

Recently, I noticed that `morphdom` (The default
library that mrujs uses to render errors) hasn't been
playing nicely with web components.

[Here is a twitter thread of the videos of using the
different error renderers](https://twitter.com/RogersKonnor/status/1502778310174068738)

The TLDR is that for some reason Turbo works quite nicely,
there's no FOUC or full page navigation, and seems to work
better than morphdom without any funky hacks. As for
performance, I haven't looked at if there's any actual
difference.

Anyways, on to how we use Turbo's in-built renderer.

There are 2 ways to opt-in to the Turbo error renderer.

A.) Set it for all errors:

```js
import mrujs from "mrujs"

mrujs.start({
  errorRenderer: "turbo"
})
```

B.) Set it only on certain forms:

```html
<form data-remote="true" data-ujs-error-renderer="turbo">
</form>
```

The default as of today is `morphdom`. Perhaps in `v1.0` this
will change.
