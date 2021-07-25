---
title: Practical Guide to mrujs
doc_order: 20
---

If you're new to the concept of UJS, or want a practical example of what
mrujs does, this document will provide a guided tour of the core
features of mrujs.

There are 2 ways to approach this guide.

1.) Create your own project with the HTML provided and play with it.
2.) Follow along with the examples provided below.

## Prerequisites

If you are going to be following along on your own project, make sure
to read the [Getting Started Guide](/tutorials/getting-started) for
instructions on how to install mrujs.

## Showing a basic confirm dialog

If I want to prompt a user before performing an action, I can throw a
`data-confirm` on clickable elements (`<button>`, `<a>`) and ask the
user to answer "yes" or "no" before continuing on with what the action
or link intends to do.

To see an example, heres a basic button:

```html
<button data-confirm="Hey! You clicked me!">
  Click me and I'll show a confirm dialog.
</button>
```

<p align="middle">
  <button class="btn btn--primary" data-confirm="Hey! You clicked me!">
    Click me and I'll show a confirm dialog.
  </button>
</p>

## Disabling Elements

mrujs believes in providing strong defaults. As a result, when forms are
submitted or links are clicked, they get automatically disabled. Heres an
example:

```html
<button id="disable-example"
        data-disable-with="Now I'm disabled...">
  I'm enabled!
</button>

<!--
  This re-enables the element after 3 seconds
  since regular buttons have no concept of when
  to re-enable themselves if theyre not part of a
  form.
-->
<script>
  document.querySelector("#disable-example").addEventListener("click", (event) => {
    setTimeout(() => window.mrujs.enableElement(event.target), 3000)
  })
</script>
```

<p align="middle">
  <button id="disable-example"
          class="btn btn--primary"
          data-disable-with="Now I'm disabled...">
    I'm enabled!
  </button>
</p>

Maybe you don't want to display any other text, maybe you just want to
disable the element. Not a problem.

<p align="middle">
  <button id="disable-example"
          class="btn btn--primary"
          data-disable="true">
    I'm enabled!
  </button>
</p>

## Sending forms and links via "AJAX"

If you're not familiar with the term AJAX, it just means sending a
request to the server asynchronously (in the background)

mrujs sends this requests via a web native API called fetch.

<https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API>

### Trigger ajax on a link

To trigger an ajax request on a link, add the
`data-remote="true"` property to the `<a>` tag like so:

```html
<a href="/" data-remote="true">
  I send a GET request to this server in the background. <br>
  Check your network tab!
</a>
```

<p align="middle">
  <a href="/" data-remote="true" style="text-align: center;">
    I send a GET request to this server in the background.
    <br>
    Check your network tab!
  </a>
</p>

### Trigger ajax on a form

```html
<form action="/" method="get" data-remote="true">
  <input class="btn btn--primary" type="submit" value="Submit via AJAX">
</form>
```

<form action="/" method="get" data-remote="true">
  <input class="btn btn--primary" style="display: flex; margin: 0 auto;" type="submit" value="Submit via AJAX">
</form>

Check your network tab! You will see the request gets sent as an "XHR"
request.

## Make a link send a request other than a GET

By default, links send `GET` requests to the server. But perhaps you
want to instead send a `DELETE` request. Heres how you would do that.

```html
<!--
If you specify data-method,
you do not need data-remote,
it is implied
-->
<a href="/" data-method="delete" data-ujs-navigate="false">
  Click me and I send a delete request
</a>
```

<p align="middle">
  <a href="/" data-method="delete" data-remote="true" data-ujs-navigate="false">
    Click me and I send a delete request
  </a>
</p>

## Making a request expect a certain response.

If you're familiar with `Accept` headers, mrujs provides a way to
expect a certain response. For example, if I want JSON to be return I
could do this:

```html
<a href="/" data-remote="true" data-type="application/json">
  Expect a JSON response
</a>
```

However, this can get annoying to type. So instead we can hook into a
shortcut provided by mrujs like so:

```html
<a href="/" data-remote="true" data-type="json">
  Expect a JSON response
</a>
```

<a href="/" data-remote="true" data-type="json">
  Expect a JSON response
</a>

A list of all shortcuts is provided here:

<https://github.com/ParamagicDev/mrujs/tree/main/src/utils/headers.ts#L3-L10>

If the predefined shortcuts feel limiting, it is possible to create your
own. To do so, check out the documentation on [MimeTypes](/references/mime-types)

## Next Steps

Now that the core of mrujs has been explained. Perhaps a good next step
would be to look at the [AJAX lifecycle](/references/ajax-lifecycle) to get an understanding on how to
hook into the ajax events. Or if you're feeling a little shaky how ajax
works, you can check out the docs on [Remote forms and links](/references/remote-forms-and-links)

<p style="margin: 2em 0;" align="middle"><a href="/references/ajax-lifecycle" class="call-to-action call-to-action--primary">AJAX Lifecycle</a></p>
<p align="middle"><a href="/references/remote-forms-and-links" class="call-to-action call-to-action--secondary">Remote Elements</a>

<script>
  // Since we're not actually submitting, we need to clear out disabled elements.
  document.addEventListener("click", (event) => {
    setTimeout(() => window.mrujs.enableElement(event.target), 3000)
  })
</script>
