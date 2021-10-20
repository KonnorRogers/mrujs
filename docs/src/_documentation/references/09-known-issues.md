---
title: Known Issues
permalink: /references/known-issues
---

## [Turbolinks Gem](#turbolinks-gem)

If you are using the `Turbolinks` gem, you can safely disable it. Having
it enabled means forms / ajax requests will not properly work as
intended.


## [204 No Content](#204-no-content)

When returning a `204 No Content`, mrujs will not automatically
redirect via Turbolinks. It's up to you to handle redirects. This is
because 204's do not return HTML.

## [Turbo Beta Integration](#turbo-integration)

Beta versions of Turbo (`v7.0.0-beta-8` and below) will show pages twice on successful
form submission that redirects causing notifications to disappear. This is fixed in
`v7.0.0-rc1` and above.

