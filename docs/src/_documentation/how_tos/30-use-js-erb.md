---
title: Using .js.erb
permalink: /use-js-erb
---

## [Rails Configuration](#rails-configuration)

If you're on Rails 5.2+ , make sure to enable the following lines in
your `config/initializers/content_security_policy.rb`:

```rb
# config/initializers/content_security_policy.rb

# If you are using UJS then enable automatic nonce generation
Rails.application.config.content_security_policy_nonce_generator = -> (request) { SecureRandom.base64(16) }

# Set the nonce only to specific directives
Rails.application.config.content_security_policy_nonce_directives = %w(script-src)
```

These lines inject a Nonce directive to allow injected scripts to be
run.

## [JavaScript Configuration](#javascript-configuration)

In your entrypoint file, (usually `app/javascript/application.js`),
import both `mrujs` and the `.js.erb` plugin like so:

```js
import mrujs from "mrujs"
import { JsErb } from "mrujs/plugins"

mrujs.start({
  plugins: [
    JsErb()
  ]
})
```

## [Final Disclosure](#final-disclosure)

`.js.erb` is considered "Deprecated" as of Rails 7. This plugin exists
as a way to help with migration, but is strongly discouraged for new
projects. For more information, feel free to read the following from
DHH:

<https://twitter.com/dhh/status/1252751363219419136?s=21>
