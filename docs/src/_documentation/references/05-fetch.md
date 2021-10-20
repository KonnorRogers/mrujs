---
title: The Fetch API
permalink: /references/fetch
---

## [Fetch](#fetch)

Fetch has the same API as the official `fetch` javascript function. The difference
between mrujs' fetch and a normal `window.fetch` is
that mrujs will prefill the `X-CSRF-TOKEN` header (authenticity token),
add an `AbortController` for cancelling fetch requests, and provide a few other
conveniences for you including merging headers.

`mrujs.fetch` accepts the exact same interface as `window.fetch` so
there is no new syntax to learn.

`mrujs.fetch` should not be used with cross domain fetches. Cross-domain
fetches should be called via `window.fetch` with proper options attached
to it.

### [Examples](#examples)

To *receive* a `json` response, make sure to set the `Accept` header to
`"application/json"` like so:

```js
window.mrujs.fetch(
  "/url",
  {headers: {"Accept": "application/json"}}
).then(response => {}).catch(error => {})
```

To *send* a `json` payload, make sure to set the `Content-Type` header to
`"application/json"` like so:

```js
window.mrujs.fetch(
  "/url",
  {
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }
).then(response => {}).catch(error => {})
```

