import { AJAX_EVENTS, dispatch, stopEverything } from '../utils/events'
import { mergeHeaders, expandUrl } from '../utils/url'
import { Locateable } from '../types'

export type FetchRequestBody = URLSearchParams | ReadableStream<Uint8Array>

export type FetchMethodString = 'get' | 'put' | 'post' | 'patch' | 'delete'

export type RequestInfo = Request | string | URL

/**
 * Fetch Request is essentially an "proxy" class meant to wrap a standard Request
 *   Object and provide some sane convetions like passing in an abort controller,
 *   auto-serialization of FormData, auto-filling X-CSRF-Token and a number of other
 *   niceties. The FetchRequest constructor follows the same conventions as fetch.
 *   It can either take in a Request object, or be giving a url and then an object
 *   with all the fetch options.
 */
export class FetchRequest {
  abortController = new AbortController()
  request: Request

  headers: Headers
  method!: FetchMethodString
  url!: URL

  body?: FetchRequestBody

  constructor (input: Request | Locateable, options: RequestInit = {}) {
    // if we're given a Request, set the method, headers and body first, then we
    // merge with the defaultRequestOptions and clone the instance of Request
    if (input instanceof Request) {
      this.setMethodAndBody(input)
      this.modifyUrl(input.url)
      this.headers = mergeHeaders(this.defaultHeaders, input.headers)
      const mergedOptions = { ...this.defaultRequestOptions, ...input }
      mergedOptions.headers = this.headers
      this.request = new Request(mergedOptions)
    } else {
      this.setMethodAndBody(options)
      this.modifyUrl(input)
      this.headers = mergeHeaders(this.defaultHeaders, new Headers(options.headers))
      const mergedOptions = { ...this.defaultRequestOptions, ...options }
      mergedOptions.headers = this.headers

      // @ts-expect-error this.url is really a URL, but typescript seems to think Request cant handle it.
      this.request = new Request(this.url, mergedOptions)
    }

    this.headers = this.request.headers
  }

  get params (): URLSearchParams {
    return this.url.searchParams
  }

  get entries (): Array<[string, FormDataEntryValue]> {
    return this.body instanceof URLSearchParams ? Array.from(this.body.entries()) : []
  }

  cancel (event?: CustomEvent): void {
    this.abortController.abort()

    // trigger event dispatching if an event gets passed in.
    if (event != null) {
      stopEverything(event)

      const { element } = event.detail

      dispatch.call(element, AJAX_EVENTS.ajaxStopped, {
        detail: { ...event.detail }
      })
    }
  }

  modifyUrl (url: Locateable): void {
    this.url = expandUrl(url)

    if (!this.isGetRequest) return

    // Append params to the Url.
    this.url = mergeFormDataEntries(this.url, this.entries)
  }

  setMethodAndBody (input: Request | RequestInit): void {
    this.method = (input.method?.toLowerCase() ?? 'get') as FetchMethodString

    if (this.isGetRequest) return

    this.body = (input.body ?? new URLSearchParams()) as FetchRequestBody
  }

  get defaultRequestOptions (): RequestInit {
    return {
      method: this.method,
      headers: this.headers,
      credentials: 'same-origin',
      redirect: 'follow',
      body: this.body,
      signal: this.abortSignal
    }
  }

  get defaultHeaders (): Headers {
    const headers: Headers = new Headers({
      Accept: '*/*',
      'X-REQUESTED-WITH': 'XmlHttpRequest'
    })

    const token = this.csrfToken

    if (token != null) {
      headers.set('X-CSRF-TOKEN', token)
    }

    return headers
  }

  get csrfToken (): string | undefined {
    if (this.isGetRequest) return

    const token = window.mrujs.csrfToken

    if (token == null) return

    return token
  }

  get isGetRequest (): boolean {
    return this.method.toLowerCase() === 'get'
  }

  get abortSignal (): AbortSignal {
    return this.abortController.signal
  }
}

function mergeFormDataEntries (url: URL, entries: Array<[string, FormDataEntryValue]>): URL {
  const currentSearchParams = new URLSearchParams(url.search)

  for (const [name, value] of entries) {
    if (value instanceof File) continue

    if (currentSearchParams.has(name)) {
      currentSearchParams.delete(name)
      url.searchParams.set(name, value)
    } else {
      url.searchParams.append(name, value)
    }
  }

  return url
}
