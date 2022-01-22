---
title: Integrate ActiveStorage with mrujs
permalink: /how-tos/integrate-activestorage
---

<%= render Alert.new(type: :danger, title: "[Removed]") do %>
  The ActiveStorage plugin has been removed as of 0.8.0
<% end %>

Mrujs comes with an in-built ActiveStorage plugin. In it's
current form its very similar to the current ActiveStorage
you see in Rails. There are plans to differentiate from the
existing implementation to leverage things like mrujs'
in-built disabling function. The adapter has the same API
as ActiveStorage shipped by Rails.

## Usage

```js
import mrujs from "mrujs"
import { ActiveStorage } from "mrujs/plugins"

mrujs.start({
  plugins: [
    ActiveStorage()
  ]
})
```

This will give you all the functionality of ActiveStorage
on forms. If however you need to use the `DirectUpload`
class directly, you can do so like this:

```js
import mrujs from "mrujs"
import { ActiveStorage } from "mrujs/plugins"

mrujs.start()


const directUpload = new ActiveStorage.DirectUpload
```
