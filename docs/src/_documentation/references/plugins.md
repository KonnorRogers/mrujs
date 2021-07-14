---
title: (Experimental) Plugins
doc_order: 60
---

## [Interface](#interface)

All plugins should implement the following interface:

`plugin.name` A getter to retrieve the name of the plugin
`plugin.connect()` A callback for when mrujs starts.
`plugin.disconnect()` A callback for fully any side effects by `connect`
such as event Listeners.

## [Using a plugin:](#using-a-plugin)

```js
import mrujs from "mrujs"
import MyPlugin from "mrujs-plugin"

mrujs.start({
  plugins: [
    new MyPlugin()
  ]
})
```

## Creating a plugin

Please note, plugins will be run in the order they are added. Perhaps in
the future there will be specific hooks, but currently, they are just an
additional operation that runs after everything else has connected
internally.

### [Using an object:](#using-an-object)

```js
const name = "my-plugin"
const MyPlugin = {
  name,
  connect: () => {console.log(`${name} connecting`)},
  disconnect: () => {console.log(`${name} disconnecting`)}
}

window.mrujs.start({
  plugins: [
    MyPlugin
  ]
})
```

### [Using a class:](#using-a-class)

```js
class MyPlugin {
  get name() {
    return "my-plugin"
  }

  connect() {
    console.log(`${this.name} connecting`)
  }

  disconnect() {
    console.log(`${this.name} disconnecting`)
  }
}

window.mrujs.start({
  plugins: [
    new MyPlugin()
  ]
})
```

