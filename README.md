# Purpose

To provide a Rails-UJS alternative since Rails UJS is currently
deprecated. Uses modern javascript instead of coffeescript.

## What does mrujs mean?

Modern Rails UJS.

## Does this support `.js.erb`

No. Rails 6.1+ requires a change in the content-security policy in relation to running
arbitrary javascript scripts which means `.js.erb` is not supported.
`.js.erb` is a security concern, and also requires a lot of `nonce` code generation and checks to work properly.

## What can it do right now?

In it's current state, Mrujs is a native fetch wrapper and
a form wrapper that can marshal an HTML / JSON / XML / any response
you want and can be listened for via event listeners. For
a list of things to be implemented in the future, checkout
the [Roadmap](#roadmap) below.

## Getting Started

1. Install `mrujs`

```bash
yarn add mrujs
```

2. Go to your Webpacker entrypoint and import `mrujs` and start it up.

```js
// app/javascript/packs/application.js

// ... other stuff

import mrujs from "mrujs";
mrujs.start();

// If you want it to work like Rails ujs.
import Rails from "mrujs";
Rails.start()

// mrujs is available globally as window.Rails or window.mrujs
```

3. Using on a form

If using Turbo, make sure to set Turbo to false.

```erb
<%= form_with scope: Model, data: {remote: "true", turbo: "false"} do |form| %>
  <%= form.label :name %>
  <%= form.text_field :name %>

  <%= form.submit "Submit", data-disable-with: "Submitting..." %>
<%= end %>

<form action="/" method="post" data-remote="true" data-turbo="false">
  <input id="foo" name="foo">
  <input type="submit" value="Submit">
</form>
```

4. Stopping Mrujs

If you would like to stop Mrujs, feel free to do the following:

```js
window.mrujs.stop();
```

This will remove all mutation observers and event listeners.

## Ajax

### Events

All events bubble and are cancellable by default.

Bubbling means they will always start from the form that submits it and
continue upwards all the way to the top of the DOM. Bubbling can be
stopped via `event.stopImmediatePropagation()`. I also allowed events to
be preventable. IE: `event.preventDefault()` on an ajax event will cause
it to stop running.

A `fetch` request or `data-remote="true"` form will emit the following events:

<details>
<summary>List of AJAX events</summary>

```js
const AJAX_EVENTS = {
  /**
   * Before the ajax event gets sent.
   * You can view what data will be sent via: `event.detail.request`
   */
  ajaxBefore: `ajax:before`,

  /**
   * When the fetch request is sent. You can view whats being sent via:
   * `event.detail.request`
   */
  ajaxSend: `ajax:send`,

  /**
   * When a response error occurs. IE: 400, 404, 422, 500, etc (any status code not between 200 - 299)
   * The response error can be viewed via: `event.detail.response`
   */
  ajaxResponseError: `ajax:response:error`,

   /**
    * When a >= 200 and <= 299 response is returned
    * You can view the full response via: `event.detail.response`
    */
  ajaxSuccess: `ajax:success`,

  /**
   * When an actual error is raised. This doesnt include 404, 500,
   * errors, just like native fetch.
   * You can view the error via: `event.detail.error`
   * This will also generate an error in your console.log
   */
  ajaxError: `ajax:error`,


  /**
   * After any fetch request, regardless of outcome
   * `event.detail.response`
   * `event.detail.error` if any found
   */
  ajaxComplete: `ajax:complete`,

  // NOT CURRENTLY IMPLEMENTED from ujs
  `ajax:aborted:required`
  `ajax:aborted:file`
}
```

</details>
  

<details>
  <summary> Diagram of Ajax form submissions </summary>
  
  <img width="632" alt="Screen Shot 2021-06-10 at 3 23 02 AM" src="https://user-images.githubusercontent.com/26425882/121482581-47675400-c99b-11eb-9a72-79a09c33ad34.png">

  [mrujs-remote-form-event-diagram.pdf](https://github.com/ParamagicDev/mrujs/files/6629160/mrujs-remote-form-event-diagram.pdf)
</details>

#### Cancelling Events

<details>
<summary> How to cancel AJAX events </summary>

You can cancel events at anytime simply by calling `event.preventDefault()` or
`event.stopImmediatePropagation()`:

Example:

```js
document.querySelector("form").addEventListener("ajax:before", (event) => {
  event.preventDefault();
})


document.querySelector("form").addEventListener("ajax:before", (event) => {
  event.stopImmediatePropagation();
})

// For extra certainty
document.querySelector("form").addEventListener("ajax:before", (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
})

```

`ajax:send` is a special case and must be aborted with an abort
controller.
</details>

### Fetch

Fetch is called like you would expect. Except it will also prefill the
`X-CSRF-TOKEN` for you. The difference between
`window.fetch` and `mrujs.fetch` is that the first argument for the url
is positional in `window.fetch`, but in `mrujs.fetch` it is required as part of the object.

`mrujs.fetch` can also leverage the events listed above for Ajax and
fire the `ajax:<lifecycle>` events if `dispatchEvents === true`. When
called this way, `mrujs.fetch` will not return a promise. Instead you
should listen for `ajax:success` and then parse the response from
`event.detail.response`.

```js
document.addEventListener("ajax:success", (event) => {
  // equivalent to fetch().then((response) => response)
  event.detail.response
})
```

#### Examples

```js
// Native Fetch
window.fetch("/url", { ... })
  .then((response) => ...)
  .catch((error) => ...)

// mrujs fetch
window.mrujs.fetch({url: "/url", ...})
  .then((response) => ...)
  .catch((error) => ...)
```

To *receive* a `json` response, make sure to set the `Accept` header to
`"application/json"` like so:

```js
window.mrujs.fetch({
  url: "/url",
  "Accept": "application/json"
}).then(response => {}).catch(error => {})
```

To *send* a `json` payload, make sure to set the `Content-Type` header to
`"application/json"` like so:

```js
window.mrujs.fetch({
  url: "/url",
  "Content-Type": "application/json"
}).then(response => {}).catch(error => {})
```

#### Using native fetch

Maybe you dont like my fetch wrapper, thats fine! To use native fetch
heres all you have to do to include the CSRF-Token.

```js
import mrujs from "mrujs"

window.mrujs =  mrujs.start()
window.fetch("url", {
  headers: {
    "X-CSRF-TOKEN": window.mrujs.csrfToken
  }
})
```

### Remote forms

Remote forms can also negotiate the proper `Accept` headers. To do so,
set the `data-type='json'` to tell the server you can only accept
json.

<details>
<summary> List of predefined `data-type` values </summary>

```js
  '*': '*/*',
  any: '*/*',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml, text/xml',
  json: 'application/json, text/javascript',
```

The above are all predefined for you
</details>

Example:

```html
<!-- Sends a `application/json` and `text/javascript` accept header. -->
<form data-remote="true" data-type="json"></form>

<!-- Sends an XML accept header -->
<form data-remote="true" data-type="application/xml"></form>

<!--- Shorthand -->

<form data-remote="true" data-type="xml"></form>


<!-- Sends a default '*/*' Accept header. -->
<form data-remote="true">
</form>
```

## Anchor methods

Sometimes you want to add additional methods to your links. Heres how to
do that:

```html
<a data-method="delete" href="/logout">
```

This will create a form, append it to the body, and then submit the form
with a hidden value with the method value set to "delete" so the server
knows to perform a delete.

## Roadmap

- [x] - add support for `data-method="<REQUEST_TYPE>"` for non-forms
it.
- [x] - `data-type='type'` for forms.
- [x] - Alias `window.Rails` to `window.mrujs` (Allows drop in
replacement)
- [x] - Allow the use of `data-confirm=""`
- [x] - Provide a confirm dialog for `data-confirm`
- [x] - Allow users to provide their own confirm function to `data-confirm`
- [ ] - Allow `ajax:send` to be cancelled via abort controllers.
- [ ] - Asset pipeline, if someone would like to add support im open to
it

## Developing locally

1. Clone the repo

```bash
git clone https://github.com/ParamagicDev/mrujs
cd mrujs
```

2. Install packages

```bash
yarn install
```

### View Dev Server

```bash
yarn start
```

### Run tests

```bash
yarn test
```

## Rails

There is also a Rails dummy app attached in this repo for testing.

### Installation

Top level:

`bundle install`

### Starting

Must be run within the `test/ruby/dummy` directory.

`cd test/ruby/dummy && bundle exec rails server`

### Tests

From any where _outside_ of the `test/ruby/dummy` directory:

`bundle exec rake test`

## Known Issues

If you are using the `Turbolinks` gem, you can safely disable it. Having
it enabled means forms / ajax requests will not properly work as
intended.
