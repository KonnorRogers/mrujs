export type Locatable = URL | string

export function expandUrl (locatable: Locatable): URL {
  return new URL(locatable.toString(), document.baseURI)
}

export function getAnchor (url: URL): string {
  let anchorMatch
  if (url.hash != null && url.hash !== '') {
    return url.hash.slice(1)
  } else if ((anchorMatch = url.href.match(/#(.*)$/)) != null) {
    return anchorMatch[1]
  } else {
    return ''
  }
}

export function urlsAreEqual (left: string, right: string): boolean {
  return expandUrl(left).href === expandUrl(right).href
}
