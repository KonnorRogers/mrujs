import { Locateable } from '../types'

export function expandUrl (locateable: Locateable): URL {
  if (urlExpanded(locateable)) {
    return new URL(locateable.toString())
  }

  return new URL(locateable.toString(), document.baseURI)
}

function urlExpanded (locateable: Locateable): boolean {
  return /^http/.test(locateable.toString())
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

export interface ObjectHeaders {
  [header: string]: string
}

export function mergeHeaders (...sources: Headers[]): Headers {
  const main: ObjectHeaders = {}

  for (const source of sources) {
    for (const [header, value] of source) {
      main[header] = value
    }
  }

  return new Headers(main)
}
