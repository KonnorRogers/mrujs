---
title: Setting a morph root
permalink: /how-tos/setting-a-morph-root
---

When submitting forms, if an error occurs, by default,
Mrujs will use a library called "morphdom" to render the
new state of the page.

Sometimes, you may want to "scope" what morphdom will
change. By default, morphdom targets `document.body`. This
may not be desireable for all circumstances.

On the submitting form you can do the following:

```html
<form data-ujs-morph-root></form>
```

and this will scope changes to only the form. If, however,
you would like to scope changes to an external element, you
can pass a valid querySelector string like so:

```html
<div id="form-errors"></div>
<form data-ujs-morph-root="#form-errors"></form>
```

This means morphdom will only show changes to the children
contained in `#form-errors`

If the `morph-root` cannot be found, mrujs will fallback to
morphing the entire body of the page.

Do note, `data-ujs-morph-root` only applies to error
handling. Successful form submissions are expected to
redirect and their HTML / navigation will be piped through
Turbo[links].

However, if you want to render successful form submissions
via morphdom, you can specify a 2nd property.

`data-ujs-morph="true"`

So at full speed you would do the following:

```html
<!-- full page morph -->
<form data-ujs-morph="true"></form>

<!-- With a morph root -->
<div id="form-errors"></div>
<form data-ujs-morph-root="#form-errors" data-ujs-morph="true"></form>

<!-- Only morph the form on success -->
<form data-ujs-morph-root data-ujs-morph="true"></form>
```
