# Purpose

To provide an upgrade path for those looking to retain the features of
UJS, but use a currently maintained library written in Typescript.

## What does mrujs mean?

Modern Rails UJS.

## Does this support `.js.erb`

No. Rails 6.1+ requires a change in the content-security policy in relation to running
arbitrary javascript scripts which means `.js.erb` is not supported.
`.js.erb` is a security concern, and also requires a lot of `nonce` code generation and checks to work properly.

## What can it do right now?

In it's current state, Mrujs is has about 95% feature parity with UJS.
The goal of Mrujs is to be a drop-in replacement for UJS, but this is
not possible in all cases.

## Integrations

Mrujs supports both Turbolinks and Turbo.

In addition, on unsuccessful form submissions, MorphDOM is used to morph
responses from the server to provide a DOM diffed update page to display
things like errors.

## Getting Started

1. Install `mrujs`

```bash
yarn add mrujs
```

1. Go to your Webpacker entrypoint and import `mrujs` and start it up.

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

1. Using on a form

If using Turbo, make sure to set Turbo to false.

```erb
<%= form_with scope: Model, local: false, data: {turbo: "false"} do |form| %>
  <%= form.label :name %>
  <%= form.text_field :name %>

  <%= form.submit "Submit", data-disable-with: "Submitting..." %>
<%= end %>
```

```html
<form data-remote="true" data-turbo="false">
</form>
```

1. Using on a link

```html
<a href="/" data-remote="true" data-turbo="false">Ajax get request</a>
```

1. Stopping Mrujs

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

A form or link with `data-remote="true"` form will emit the following events:

```console
ajax:before
ajax:beforeSend
ajax:send
ajax:request:error
ajax:response:error
ajax:error # => will catch both request and response errors.
ajax:success # => will only fire if no errors
ajax:complete
ajax:stopped # => when event.preventDefault() is called or event.detail.fetchRequest.cancel(event) is called.
```

* Diagram of Ajax form submissions

<img width="632" alt="Screen Shot 2021-06-10 at 3 23 02 AM" src="https://user-images.githubusercontent.com/26425882/121482581-47675400-c99b-11eb-9a72-79a09c33ad34.png">

[mrujs-remote-form-event-diagram.pdf](https://github.com/ParamagicDev/mrujs/files/6629160/mrujs-remote-form-event-diagram.pdf)

### All properties available on event.detail

```js
element // => either form or link element that initiated request
fetchRequest // => FetchRequest (wrapper around Request)
request // => Request
fetchResponse // => FetchResponse (wrapper around Response)
response // => Response
submitter // => The button clicked to initiate the submit. Button / Link element
submission // => Either FormSubmission or LinkSubmission.
```

#### Note about remote / ajax links

`<a href="/" data-method="delete" data-remote="true">` does not go
through the `submit` event, it skips to `ajax:before`, this is due to
how submit events are intercepted.

#### Cancelling Events

Cancelling Ajax events is fairly straightforward with only 1 edge case
with `ajax:send`.

You can cancel events at anytime simply by calling `event.preventDefault()`.

Example:

```js
document.querySelector("form").addEventListener("ajax:before", (event) => {
  event.preventDefault();
})
```

`ajax:send` is a special case and must be aborted with an abort
controller. To do so, you would do the following:

```js
document.querySelector("form").addEventListener("ajax:send", (event) => {
  event.detail.fetchRequest.cancel(event)
  // => If event is not passed in, it wont fire a `ajax:stopped` event.
})
```

#### WARNING:

Be careful if you call `event.stopImmediatePropagation()` or
`event.stopPropagation()`. This will cause `ajax:stopped` to not fire
and will leave your buttons in a disabled state that you must handle.

### Fetch

Fetch is called like you would expect. Except it will also prefill the
`X-CSRF-TOKEN`, add an `AbortController`, and provide a few other
niceties for you.

`mrujs.fetch` accepts the exact same interface as `window.fetch` so
there is no new syntax to learn.

`mrujs.fetch` should not be used with cross domain fetches. Cross-domain
fetches should be called via `window.fetch` with proper options attached
to it.

#### Examples

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

### Remote forms

Remote forms can also negotiate the proper `Accept` headers. To do so,
set the `data-type='json'` to tell the server you can only accept
json.

Mrujs defined a number of predefined `data-type` 's for you.

```js
  '*': '*/*',
  any: '*/*',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml, text/xml',
  json: 'application/json, text/javascript',
```

This means you can pass a `data-type="*"`, `data-type="text"`,
`data-type="xml"`, and so on as long as it matches with that key. If
you need a custom Accept header, you will have to simply do it yourself
like so:

`<form data-type="application/xml, text/xml">`

Examples:

```html
<!-- Sends a `"application/json, text/javascript"` Accept header. -->
<form data-remote="true" data-type="json"></form>

<!-- Sends an XML accept header -->
<form data-remote="true" data-type="application/xml"></form>

<!--- Shorthand -->
<form data-remote="true" data-type="xml"></form>


<!-- Sends a default '*/*' Accept header. -->
<form data-remote="true"></form>
```

## Anchor methods

Sometimes you want to add additional methods to your links. Heres how to
do that:

```html
<a data-method="delete" href="/logout">
```

This will create a `fetch` request and then navigate to the new page if
redirected, or refresh the current page is no redirect found.

## Reference

The following `data-*` attributes attach behavior in mrujs:

```js
data-remote="true"
// => Make a link or form submit via AJAX

data-method="delete"
// => Make a link perform the method via AJAX

data-confirm="Are you sure?"
// => Pulls up a confirm dialog when the element is clicked

data-disable="true"
// => Disables the submit element clicked in a form / link and reenables it on success

data-disable-with="Submitting..."
data-disable-with="<div class="spinner">Submitting...</div>"
// => Replaces the current innerHTML of the clicked input / link with
//    the text / html in data-disable-with

data-type="mimeType"
// => Uses the value as the Accept header for the link / form.

```

## Working with Turbo

Turbo and Mrujs have some conflicting pieces of functionality. In order
to avoid clashing with Turbo, some data attributes require explicitly
setting `data-turbo="false"`

### Attributes that need `data-turbo="false"`

```
data-remote="true"
data-method="patch"
```

### Attributes that don't need `data-turbo="false"`

```
data-confirm="Are you sure?"
data-disable="true"
data-disable-with="Submitting..."
```

Also of note, Turbo has its own `data-method`, to avoid conflicts with
mrujs' `data-method`, please use `data-turbo-method` when you want to
use Turbo's version of link methods.

## Extending Mrujs

### (Experimental) QuerySelectors

Mrujs comes with a number of preconstructed querySelectors. These can be
extended with the following API:

```js
import mrujs from "mrujs"

// Save the original
const originalSelectors = mrujs.querySelectors

// Modify it.
originalSelectors.linkDisableSelector.selector += ", my-custom-element"

// Push it back in.
mrujs.querySelectors = originalSelectors

// Now start!
mrujs.start()
```

Important to note, you must set these before starting mrujs.
If you want to set the querySelectors mid-session, you will have to
follow the above steps, but instead of calling `start`, you would call `mrujs.restart()`.

A list of all `querySelectors` and their strings can be found in the
[src/utils/dom.ts](/src/utils/dom.ts) file.

### (Expiremental) MimeTypes

Mrujs comes with a set of predefined MimeTypes for `AcceptHeaders`.
These can be modified to include additional shortcuts.

Here is an example of adding a custom CableCar mimetype.

```js
import mrujs from "mrujs"

mrujs.registerMimeTypes(
  [
    {shortcut: "cablecar", header: "text/vnd.cablecar.json"}
  ]
)

mrujs.start()
```

Then in a form you can do the following to set the proper Accept header
with shorthand syntax.

```html
<form data-remote="true" data-type="cablecar"></form>
```

and this will set the Accept header to `"text/vnd.cablecar.json"`

#### Default accept header.

By default, Mrujs will use the `mrujs.mimeTypes.any` which is `"*/*"` if
a `data-type` is not found on the element performing a `data-method` or
a form.

If you would like to override this, you can do so with the following
syntax:

```js
mrujs.registerMimeTypes(
  [
    {shortcut: "any", header: "text/vnd.my-custom-header, */*"}
  ]
)
```

Now, `"text/vnd.my-custom-header"` will take precendence over other
responses.

### Experimental (Plugins)

All plugins should implement the following interface:

`plugin.name` A getter to retrive the name of the plugin
`plugin.connect()` is for when Mrujs starts.
`plugin.disconnect()` a fully reversible way to get rid of any side effects
like event Listeners.

Using a plugin:

```js
import mrujs from "mrujs"
import MyPlugin from "mrujs-plugin"

mrujs.start({
  plugins: [
    new MyPlugin()
  ]
})
```

Please note, plugins will be run in the order they are added. Perhaps in
the future there will be specific hooks, but currently, they are just an
additional operation that runs after everything else has connected
internally.

### Plugin examples

Using an object:

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

Using a class:

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

## Plugins

### CableCar

Mrujs has an official first class plugin for use with CableReady's JSON
serializer called CableCar! If you do not already have CableReady in
your `package.json`, you must add it. Mrujs does not ship CableReady, it
is up to you to install it and pass it into the CableCar plugin.

#### Installing CableReady

`yarn add cable_ready`

#### Using Cable Car

To use the plugin, we start mrujs as
normal, but then pass in a configuration defining plugins.

```js
import CableReady from "cable_ready"
import mrujs, { CableCar } from "mrujs"

mrujs.start({
  plugins: [
    new CableCar(CableReady)
  ]
})
```

Now, any element with `data-cable-car` will get `data-remote="true"` and
`data-type="json"` which means that anything with `data-cable-car` will
perform an AJAX request, return JSON, and then automatically performs
CableReady operations on the JSON payload.

### Example

```html
<a href="/url" data-method="patch" data-cable-car>I get used by CableCar!</a>
```

Turns into:

```html
<a href="/url" data-method="patch" data-cable-car data-remote="true" data-type="json">Click
me</a>
```

## Known Issues

### Turbolinks Gem

If you are using the `Turbolinks` gem, you can safely disable it. Having
it enabled means forms / ajax requests will not properly work as
intended.


### 204 No Content

When returning a `204 No Content`, Mrujs will not automatically
redirect via Turbolinks. It's up to you to handle redirects. This is
because 204's do not return HTML.

### Turbo Integration

Currently, Turbo will show pages twice on successful form submission
that redirects causing notifications to disappear. This is fixed on
`main` by this PR: https://github.com/hotwired/turbo/pull/301

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

