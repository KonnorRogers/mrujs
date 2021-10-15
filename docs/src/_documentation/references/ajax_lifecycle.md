---
title: Ajax Lifecycle
doc_order: 30
---

## Events

All events bubble and are cancellable by default.

Bubbling means they will always start from the form / link that submits the event and
continues upward all the way to the top of the DOM. Bubbling can be
stopped via `event.stopImmediatePropagation()`. Events are also
cancelable / preventable in the following way:

calling `event.preventDefault()` on an ajax event will cause it to stop running.

A form / link with the `data-remote="true"` attribute or a link with `data-method="<method>"`
will fire the following events:

```bash
ajax:before
ajax:beforeSend
ajax:send
ajax:request:error # => Error sending the request
ajax:response:error # => 404s, 500s, etc
ajax:error # => will catch both request and response errors.
ajax:success
ajax:complete
ajax:beforeNavigation # => fires before the navigation adapter, can be stopped.
ajax:stopped # => when event.preventDefault() is called or event.detail.fetchRequest.cancel(event) is called.
```

* Diagram of Ajax form submissions

<img width="632" alt="Screen Shot 2021-06-10 at 3 23 02 AM" src="https://user-images.githubusercontent.com/26425882/121482581-47675400-c99b-11eb-9a72-79a09c33ad34.png">

[mrujs-remote-form-event-diagram.pdf](https://github.com/ParamagicDev/mrujs/files/6629160/mrujs-remote-form-event-diagram.pdf)

## All properties available on event.detail

```js
element // => either form or link element that initiated request
fetchRequest // => FetchRequest (wrapper around Request)
request // => Request
fetchResponse // => FetchResponse (wrapper around Response)
response // => Response
submitter // => The button clicked to initiate the submit. Button / Link element
submission // => Either FormSubmission or MethodSubmission.
status // => available for ajax:success, ajax:complete, ajax:response:error, ajax:error
```

<%= render(Alert.new(title: "Warning: About remote / ajax links", type: :warning)) do %>
  <code class="highlight">&lt;a href="#" data-method="delete" data-remote="true"&gt;
    <br>
    &nbsp;&nbsp;Link
    <br>
    &lt;/a&gt;
  </code>
  does not fire the <code class="highlight">submit</code> event, it skips to <code class="highlight">ajax:before</code>, this is due to
  to the fact that links do not actually trigger a <code class="highlight">submit</code> event.
<% end %>

## Cancelling Events

Cancelling Ajax events is fairly straightforward with only 1 edge case
involving the `ajax:send` event which we will cover below.

We can cancel events at anytime by calling `event.preventDefault()`.

Example:

```js
document.querySelector("form").addEventListener("ajax:before", (event) => {
  event.preventDefault();
})
```

`ajax:send` is a special case and must be aborted with an abort
controller. To do so, we must do the following:

```js
document.querySelector("form").addEventListener("ajax:send", (event) => {
  event.detail.fetchRequest.cancel(event)
})
```

<sl-alert type="warning" open>
  <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
  <strong>Warning:</strong>
  Be careful if we call <code class="highlight">event.stopImmediatePropagation()</code> or
  <code class="highlight">event.stopPropagation()</code>, this will prevent the
  <code class="highlight">ajax:stopped</code> or <code class="highlight">ajax:completed</code> events
  from firing and will leave our buttons in a disabled state that we must handle manually.
</sl-alert>


