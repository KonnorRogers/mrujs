---
title: Programmatically Fetch and send events
---

Remember how I said earlier its just fetch? Well there are 3 additional
options that can be added to `mrujs.fetch()` to allow you to dispatch
fetch through the event chain.

## [API](#api)

```js
window.mrujs.fetch("/url", {
  element: HTMLElement (defaults to document.documentElement),
  dispatchEvents: boolean (defaults to false),
  submitter: HTMLButtonElement | HTMLInputElement | undefined (button or input[type="submit"]),
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

To pass in your own FormData and use it as the `body` of the fetch request there are a couple steps to take. If your FetchRequest is a `GET` request, make sure to serialize it first with `window.mrujs.urlEncodeFormData(formData)`

You should generally serialize any data you would send in a form this way. However, there are other ways to send FormData. When sending the FormData, the `Content-Type` header will be automatically set for you based on the `body` passed in.

Here is a video explaining this concept: <https://youtu.be/G9PpImUEeUA?t=62>

Between 1:00 - 2:15 should give you most of the info you need.

In a nutshell, if youre sending regular data, use `urlEncodeFormData` to wrap your `FormData` for best performance and reduced payload size (`urlEncodeFormData` returns an instance of `URLSearchParams`). If you're sending form data with `File` instances, use `FormData`. If you're sending single files, use a `Blob`, and so on and so forth.


### [Example using FormData](#example-using-formdata)

```js
const formData = new FormData()
formData.append("param1", "value1")

window.mrujs.fetch("/url", {
  body: window.mrujs.urlEncodeFormData(formData)
}).then(() => {}).catch((err) => console.error(error))
```
