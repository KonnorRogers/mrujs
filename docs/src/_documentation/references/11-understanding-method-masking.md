---
title: Understanding Method Masking
permalink: /understanding-method-masking
---

Mrujs has a special technique it uses for all links to use
`data-method="<method>"` using native fetch without having to return a
303 header from your server.

To do so, mrujs will fill any request that is not a `GET` or `POST`
request and "mask" it under a POST request.

Example:

`<a href="/" data-method="delete">Delete Request!</a>`

this doesnt actually send a fetch request with a delete verb. Instead,
its roughly equivalent to the following:

```js
fetch("/", { method: "POST", body: { "_method": "delete" }})
```

This is how Rails handle non-POST / non-GET requests on forms! This
method masking can be turned off, but make sure your server sends back a
303 Header on all redirects otherwise, all requests in the redirect
chain will be delete requests.

Further reading on why this is needed can be found here:

<https://github.com/hotwired/turbo/issues/84>

To turn off method masking, you can do the following when you start
mrujs:

```js
import mrujs from "mrujs"
mrujs.start({
  maskLinkMethods: false
})
```
