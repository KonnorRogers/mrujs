---
title: Using Shoelace with mrujs
permalink: /how-tos/using-shoelace-with-mrujs
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

## Usage with Rails view helpers

Currently there is a PR sitting for changing the wrapper_tag of
`form_with`. <https://github.com/rails/rails/pull/42964>

In the meantime, here are some ViewHelpers created by @yuki to help use
Shoelace with Rails form helpers:

<https://github.com/yuki24/shoelace-rails>

Shoelace-Rails also has a frontend package which clobbers
a lot of mrujs behavior and is not recommended, but the ViewHelpers should work fine.

If you would prefer to not use the ViewHelpers, thats fine too. They
aren't required to use Shoelace with Rails.
