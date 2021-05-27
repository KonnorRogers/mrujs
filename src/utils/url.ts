export type Locatable = URL | string

export function expandUrl(locatable: Locatable) {
  return new URL(locatable.toString(), document.baseURI)
}

export function getAnchor(url: URL) {
  let anchorMatch
  if (url.hash) {
    return url.hash.slice(1)
  } else if (anchorMatch = url.href.match(/#(.*)$/)) {
    return anchorMatch[1]
  } else {
    return ""
  }
}

export function urlsAreEqual(left: string, right: string) {
  return expandUrl(left).href == expandUrl(right).href
}
