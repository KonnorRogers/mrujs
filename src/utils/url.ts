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

export function urlsAreEqual (left: Locateable, right: Locateable): boolean {
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

export function isGetRequest (method: string): boolean {
  return method.toLowerCase() === 'get'
}
