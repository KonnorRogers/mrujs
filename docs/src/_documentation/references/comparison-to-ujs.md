---
title: Comparison to UJS
doc_order: 10
---

Before we start comparing, let's start with why.

## [Why mrujs?](#why-mrujs)

Mrujs is intended to provide an easier upgrade path from Rails 6 to
Rails 7 by continuing to use the UJS API already present in UJS enabled apps
while being an up-to-date library that works well with Turbolinks or Turbo.

In addition, mrujs is compatible with more than just Rails, we can use it with other Ruby frameworks
like Hanami, Roda, Sinatra, etc. and even outside of the Ruby sphere!

Mrujs is also the spiritual successor to `rails-ujs` which
is the successor to `jquery-ujs`. Mrujs is just doing its part to
continue the chain of succession.

## [What is the same?](#what-is-the-same)

We worked hard to make sure mrujs is as "drop-in" as possible for 95% of
the use-cases of UJS.

Popular use-cases include:

- Remote (ajax) forms
- Remote / method links
- Disabled text on button / link click
- Confirm dialogs

## [What is new?](#what-is-new)

- Written in TypeScript.
- Uses the [morphdom](https://github.com/patrick-steele-idem/morphdom) library to update forms that fail validations.
- Fully client side navigation via Fetch + Turbo(links)
- A plugin system, with batteries-included support for [CableReady operations](https://cableready.stimulusreflex.com/reference/operations)
- Documentation!

## [What is incompatible with mrujs?](#what-is-incompatible-with-mrujs)

- `.js.erb` is a relic of the past.
- `Rails.ajax()` is out, fetch support is in! (Stop trying to make fetch happen!)
- Event details. Event details got a revamp and now contain much more info.
- No more Turbolinks gem.
- No more CoffeeScript.
- No more feelings of abandonment.

## [Why is `.js.erb` deprecated?](#why-is-jserb-deprecated)

For a multitude of reasons.

Rails 6.1+ requires a change in the content-security policy in relation to running
arbitrary javascript through script tags which means `.js.erb` is not supported.

`.js.erb` is a security concern, and also requires a lot of `nonce` code generation and checks to work properly.

Generally injecting javascript from the server into the DOM is frowned upon. I cannot
in good conscious support this method of writing views.

