---
title: Beginner's Guide to mrujs
doc_order: 20
---

If you're new to the concept of UJS, or want a practical example of what
mrujs does, this document will provide a guided tour of the core
features of mrujs.

There are 2 ways to approach this guide. take the HTML and add it to

1.) Create your own project and play with it.
2.) Follow along with the examples provided below.

## Prerequisites

If you are going to be following along on your own project, make sure
to read the [Getting Started Guide](/tutorials/getting-started)

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
        data-disable-with="Now I'm disabled..."
        data-remote="true">
  I'm enabled!
</button>

<!--
  This re-enables the element after 3 seconds since regular buttons
  have no concept of when to re-enable themselves if theyre not part of a
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
          data-disable-with="Now I'm disabled..."
          data-remote="true">
    I'm enabled!
  </button>
</p>

<script>
  document.addEventListener("click", (event) => {
    setTimeout(() => window.mrujs.enableElement(event.target), 3000)
  })
</script>
