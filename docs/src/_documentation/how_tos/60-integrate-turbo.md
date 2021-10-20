---
title: Integrate Turbo with mrujs
permalink: /how-tos/integrate-turbo
---

Mrujs ships with a plugin to automatically handle TurboStream responses.

To use this plugin, you do the following:

```js
import * as Turbo from "@hotwired/turbo"
import mrujs from "mrujs"
import { MrujsTurbo } from "mrujs/plugins"

mrujs.start({
  plugins: [
    MrujsTurbo()
  ]
})
```

And you're off to the races! Now all TurboStream responses will be
handled for you!

