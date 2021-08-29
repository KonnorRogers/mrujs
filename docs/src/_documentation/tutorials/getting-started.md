---
title: Getting Started
doc_order: 10
---

## [1. Install Mrujs](#1-install-mrujs)

```bash
yarn add mrujs
```

## [2. Import Mrujs](#2-import-mrujs)

### [With Turbo](#with-turbo)

```js
// app/javascript/packs/application.js

import mrujs from "mrujs";
import * as Turbo from "@hotwired/turbo";

// Turbo must be set before starting mrujs for proper compatibility with querySelectors.
window.Turbo = Turbo;

mrujs.start();
```

### [With Turbolinks](#with-turbolinks)

```js
import mrujs from "mrujs";
import Turbolinks from "turbolinks";

mrujs.start();
Turbolinks.start();
```

## [3. Ajax Form submissions](#3-ajax-form-submissions)

<sl-alert type="warning" open>
  <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
  <strong>Warning:</strong>
  If using Turbo, make sure to set <code>data-turbo="false"</code> to avoid any event
  conflicts.

  <br>

  As of <code>v0.4.2</code>, <code>data-turbo="false"</code> will automatically be
  set for you.
</sl-alert>

### [With Rails form helpers](#with-rails-form-helpers)

```erb
<%%= form_with scope: Model, local: false do |form| %>
  <%%= form.label :name %>
  <%%= form.text_field :name %>

  <%%= form.submit "Submit", data-disable-with: "Submitting..." %>
<%%= end %>
```

### [With regular HTML](#with-regular-html)

```html
<form method="post" action="/users" data-remote="true">
  <label for="user[name]">Name</label>
  <input id="user[name]">

  <input type="submit" data-disable-with="Submitting...">
  <!-- OR -->
  <button type="submit" data-disable-with="Submitting...">
</form>
```

## [4. Sending an Ajax `DELETE` request from a link](#4-sending-an-ajax-delete-request-from-a-link)

```html
<a href="/" data-method="delete">Ajax delete request</a>
```

## [5. Stopping Mrujs](#5-stopping-mrujs)

If you would like to stop Mrujs, feel free to do the following:

```js
window.mrujs.stop();
```

This will remove all mutation observers and event listeners.

## [Next Steps](#next-steps)

Check out the [Practical Guide to mrujs](/tutorials/practical-guide-to-mrujs) for
a guide tour of whats possible with mrujs!
