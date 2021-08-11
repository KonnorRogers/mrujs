---
title: (Experimental) Async Confirm Dialogs
doc_order: 120
---

Mrujs offers an alternative to `window.confirm()` dialogs in the form of
`data-ujs-confirm="<text>"` which will display a modal which will not block the
main thread.

This is currently implemented via a Web Component and is considered
experimental until the API is improved and iterated upon.

Example:

```js
<a href="/logout" data-method="delete" data-ujs-confirm="Are you sure?">
  Log out
</a>
```

There are some issues around I18n which will need to be addressed with
this component.
