---
title: Programmatically Fetch and send events
---

Remember how I said earlier its just fetch? Well there are 3 additional
options that can be added to `mrujs.fetch()` to allow you to dispatch
fetch through the event chain.

## [API](#api)

```js
window.mrujs.fetch("/url", {
  submitter: HTMLButtonElement | HTMLInputElement (button or input[type="submit"]),
  element: HTMLElement (defaults to document.documentElement),
  dispatchEvents: boolean (defaults to false)
})
```

## [Using the `Request` object:](#using-the-request-object)

```js
const request = new Request("/url")
window.mrujs.fetch(request, { dispatchEvents: true })
```

## Explanation

`dispatchEvents` is fairly self explanatory :)
The `element` is the element submitting the event (usually a form)
The `submitter` is the element that triggers the submit event (usually an `<input type="submit">`)

## Supplying your own FormData

To pass in your own FormData and it as the `body` of the fetch request.
