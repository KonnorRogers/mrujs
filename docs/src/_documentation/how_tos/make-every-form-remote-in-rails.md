---
title: Make Every Form a Remote Form in Rails
doc_order: 40
---

Rails has a special configuration for remote forms as of `v6.1` that
makes all forms created with `form_with` to automatically add the
`data-remote="true"` attribute to it. Prior to `v6.1`, `form_with`
automatically generated remote forms without this configuration option.

To do so, go to `config/application.rb` and add the following lines
inside of the Application module, like so:

```rb
# config/application.rb

# above code omitted for brevity.

module MyApp
  class Application < Rails::Application
    # ...
    config.action_view.form_with_generates_remote_forms = true
  end
end
```

