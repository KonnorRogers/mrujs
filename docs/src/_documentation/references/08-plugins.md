---
title: (Experimental) Plugins
permalink: /plugins
---

## [Plugin Interface](#plugin-interface)

### [Required](#required)

All plugins should implement the following interface:

`plugin.name` A getter to retrieve the name of the plugin
`plugin.connect()` A callback for after mrujs has added all its event listeners
`plugin.disconnect()` A callback for fully reversing any side effects caused by `plugin.connect()`
such as event Listeners.

### [Optional](#optional)

The following are optional interfaces on a plugin:

`plugin.initialize()` this will run before mrujs runs `connect()` and installs all event listeners. This only runs 1 time on start.
`plugin.observerCallback(addedNodes)` Hooks into the
mutation observer of mrujs and provides any array of `Node`s to act
upon.

## [Using a plugin](#using-a-plugin)

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

