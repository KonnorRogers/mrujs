---
title: Integrate CableCar
permalink: /how-tos/integrate-cablecar
---

## [CableCar](#cablecar)

Mrujs has an official first class plugin for use with CableReady's JSON
serializer called [CableCar](https://cableready.stimulusreflex.com/v/v5/cable-car)!
If you do not already have CableReady in your `package.json`, you must add it.
Mrujs does not ship CableReady, it is up to you to install it and pass it into
the CableCar plugin.

## [Installing CableReady](#installing-cableready)

```base
bundle add cable_ready -v ">= 5.0.0.pre3"
yarn add cable_ready@latest
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
"text/vnd.cable-ready.json, */*"
```

which means any link or form with `data-method="<method>"` or `data-remote="true"` will
perform an AJAX request, return JSON if it finds a CableCar response from your Rails
server (or any Ruby server which provides a `Content-Type: text/vnd.cable-ready.json`
header), and then automatically perform CableCar operations defined in the JSON payload
return.

Note that you can also configure the `Accept` header, by using the `mimeType` option:

```js
mrujs.start({
  plugins: [
    new CableCar(CableReady, { mimeType: "application/vnd.cable-ready.json" })
  ]
})
```

## [Examples](#examples)

```html
<a href="/url" data-method="patch">
  I get used by CableCar!
</a>

<form method="POST" data-remote="true">
 <input type="submit" value="Submit me and get CableCar JSON back!">
</form>
```

