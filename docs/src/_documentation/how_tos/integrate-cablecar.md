---
title: Integrate CableCar
doc_order: 10
---

## [CableCar](#cablecar)

Mrujs has an official first class plugin for use with CableReady's JSON
serializer called CableCar! If you do not already have CableReady in
your `package.json`, you must add it. Mrujs does not ship CableReady, it
is up to you to install it and pass it into the CableCar plugin.

## [Installing CableReady](#installing-cableready)

```base
yarn add cable_ready
```

## [Using CableCar](#using-cablecar)

To use the plugin, we start mrujs as
normal, but then pass in a configuration defining plugins.

```js
import CableReady from "cable_ready"
import mrujs from "mrujs"
import { CableCar } from "mrujs/plugins"

mrujs.start({
  plugins: [
    new CableCar(CableReady)
  ]
})
```

Now, any link or form with `data-method="<method>"` or `data-remote="true"` will have the following `Accept` header:

```js
"text/vnd.cablecar.json, */*"
```

which means any link or form with `data-method="<method>"` or `data-remote="true"` will
perform an AJAX request, return JSON if it finds a cablecar response on your Rails server,
and then automatically performs CableCar operations defined in the JSON payload return.

## [Examples](#examples)

```html
<a href="/url" data-method="patch">
  I get used by CableCar!
</a>

<form data-remote="true">
 <input type="submit" value="Submit me and get CableCar JSON back!">
</form>
```

