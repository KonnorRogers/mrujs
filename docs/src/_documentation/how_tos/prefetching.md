---
title: Prefetching
doc_order: 20
---

## [Why should I prefetch?](#why-should-i-prefetch)

Because who doesn't love a nice warm cache on a cold winter day?

## [Requirements](#requirements)

If you're using `Turbolinks`, feel free to jump ahead to
[How do I prefetch?](#how-do-i-prefetch)

If you're using `Turbo`, please read below about the current issues with
Snapshot caching.

<%= render Alert.new(type: :warning, title: "Warning: Turbo users") do %>
  Turbo recently merged the ability to prefetch into the main branch. Mrujs will
  throw a warning if prefetching is not enabled. To use the latest
  version of Turbo add the following to your <code class="highlight">package.json</code>.
<% end %>

```json
  {
    "dependencies": {
      "@hotwired/turbo": "https://github.com/hotwired/dev-builds/archive/@hotwired/turbo/latest.tar.gz"
    }
  }
```


## [How do I prefetch?](#how-do-i-prefetch)

Prefetching in mrujs leverages Turbo(links) snapshot cache.

Prefetching expects two things, a string of HTML, and a url.

```js
window.mrujs.navigationAdapter.prefetch({
  url: "/how-tos",
  html: "<div>Hi</div>"
})
```

<%= render(Alert.new(type: :danger)) do %>
  The snapshot cache expects <code class="highlight">new URL("/how-tos", document.baseURI)</code> for
  the url. This is prefilled for you by mrujs. If you're prefetching a
  different location with a baseURI different from the current baseURI, make sure to pass in
  an instance of URL with the proper domain.
<% end %>

The above is kind of a contrived example. Lets look at how we would prefetch
using an AJAX request.

## [Prefetching with fetch](#prefetching-with-fetch)

<%= render Alert.new do %>
  All of the below can be run in the devTools console since this site
  uses mrujs! So feel free to open up the console and run the following
  commands!
<% end %>

To prefetch with fetch is fairly straightforward. We fetch the url, we
parse the response, then we pass the response to the prefetch function.
Lets look at an example:

```js
const url = "/how-tos"
window.mrujs.fetch(url, { method: "get" })
  .then((response) => response.text())
  .then((html) => window.mrujs.navigationAdapter.prefetch({ url, html }))
  .catch((err) => console.error(err))
```

## [Inspecting the cache](#inspecting-the-cache)

Mrujs also exposes the cache of your currently selected
navigationAdapter. (Turbo or Turbolinks)

To get the cache, we can do the following:

```js
window.mrujs.navigationAdapter.snapshotCache
```

If you're in a browser you should see a cache object pop up with `keys`,
`snapshots`, and a few other functions.

The next thing we will be looking at is `snapshotCache.has()`.

## [Preventing overfetching](#preventing-overfetch)

Mrujs provides a nice wrapper around `snapshotCache.has()` called
`cacheContains("/url")`.

To check if we've already fetched a location we can do the following:

```js
window.mrujs.navigationAdapter.cacheContains("/how-tos") // => true
```

This will return a `boolean` which will tell us if we've already fetched
the given url.

So we can adapt the previous function we used to prefetch to now check
if we've already prefetched the url.

```js
const { navigationAdapter } = window.mrujs // Shortcut for the nav adapter.
const url = "/how-tos"

// If the url is not in the cache, go out and fetch it.
if (navigationAdapter.cacheContains(url) === false) {
  window.mrujs.fetch(url, { method: "get" })
    .then((response) => response.text())
    .then((html) => navigationAdapter.prefetch({ url, html })
    .catch((err) => console.error(err))
}
```

And that wraps up how we can prefetch URLs using mrujs! Good luck and
may you caches always be warm!

