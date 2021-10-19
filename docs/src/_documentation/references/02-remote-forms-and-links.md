---
title: Understanding Remote Forms and Links
permalink: /remote-forms-and-links
---
What are remote forms and links? When you see the word "Remote" referencing forms or links,
it means the element is submitting its contents via "AJAX".

### Negotiating proper Accept Header

Remote forms can also negotiate the proper `Accept` headers. To do so,
set the `data-type='json'` to tell the server you can only accept
json.

mrujs defined a number of predefined `data-type` 's for you.

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
<!-- Sends an `"application/json, text/javascript"` Accept header. -->
<form data-remote="true" data-type="json"></form>

<!-- Sends an XML accept header -->
<form data-remote="true" data-type="application/xml"></form>

<!--- Shorthand -->
<form data-remote="true" data-type="xml"></form>

<!-- Sends a default '*/*' Accept header. -->
<form data-remote="true"></form>
```

## [Anchor methods](#anchor-methods)

Sometimes you want to add additional methods to your links. Heres how to
do that:

```html
<a data-method="delete" href="/logout">
```

This will create a `fetch` request and then navigate to the new page if
redirected, or refresh the current page is no redirect found.

## [Reference](#reference)

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

data-type="<mimeType>"
// => Uses the value as the Accept header for the link / form.

```

## [Working with Turbo](#working-with-turbo)

Turbo and mrujs have some conflicting pieces of functionality. In order
to avoid clashing with Turbo, remote elements and forms require
setting `data-turbo="false"`, mrujs will do this automatically for you
when it detects `data-remote="true"`, or `data-method="<method>"` on a
link or form.

### [Attributes that need `data-turbo="false"`](#attributes-that-need-data-turbofalse)

<%= render(Alert.new(title: "Note:", type: :primary)) do %>
  As of `v0.4.2`, mrujs will automatically attach `data-turbo="false"` on
  these elements if `data-turbo` is not already set.
<% end %>

```
data-remote="true"
data-method="patch"
```

### [Attributes that don't need `data-turbo="false"`](#attributes-that-dont-need-data-turbofalse)

```
data-confirm="Are you sure?"
data-disable="true"
data-disable-with="Submitting..."
```

Also of note, Turbo has its own `data-method`, to avoid conflicts with
mrujs' `data-method`, please use `data-turbo-method` when you want to
use Turbo's version of link methods.

## Navigation Adapter

mrujs has a built in navigation adapter which will navigate a user from
page to page using Morphdom or Turbo(links) if it receives an HTML
response. If you would like to opt out of the navigation, you can
specify a `data-ujs-navigate="false"` on the element.
