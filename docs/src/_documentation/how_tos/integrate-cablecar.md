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
import mrujs, { CableCar } from "mrujs"

mrujs.start({
  plugins: [
    new CableCar(CableReady)
  ]
})
```

Now, any element with `data-cable-car` will get `data-remote="true"` and
`data-type="json"` which means that anything with `data-cable-car` will
perform an AJAX request, return JSON, and then automatically performs
CableReady operations on the JSON payload.

## [Example](#example)

```html
<a href="/url" data-method="patch" data-cable-car>
  I get used by CableCar!
</a>
```

Turns into:

```html
<a href="/url" data-method="patch" data-remote="true" data-type="json" data-cable-car="">
  Click me
</a>
```

