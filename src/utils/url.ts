export type Locateable = URL | string

export function expandUrl (locateable: Locateable): URL {
  return new URL(locateable.toString(), document.baseURI)
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
