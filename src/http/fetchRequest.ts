import { AJAX_EVENTS, dispatch, stopEverything } from '../utils/events'
import { isGetRequest, mergeHeaders, expandUrl } from '../utils/url'
import { getToken } from '../csrf'
import { RequestInfo, FetchRequestBody, FetchRequestInterface, Locateable } from '../types'

/**
 * Fetch Request is essentially an "proxy" class meant to wrap a standard Request
 *   Object and provide some sane convetions like passing in an abort controller,
 *   auto-serialization of FormData, auto-filling X-CSRF-Token and a number of other
 *   niceties. The FetchRequest constructor follows the same conventions as fetch.
 *   It can either take in a Request object, or be giving a url and then an object
 *   with all the fetch options.
 */
export function FetchRequest (input: Request | Locateable, options: RequestInit = {}): FetchRequestInterface {
  const abortController = new AbortController()
  const abortSignal = abortController.signal

  let headers: Headers
  let url
  let body: FetchRequestBody | undefined
  let method = 'get'
  let request

  let _isGetRequest = false

  if (input instanceof Request) {
    method = getMethod(input)
    _isGetRequest = isGetRequest(method)
    body = getBody(input)
    url = getUrl(input.url, _isGetRequest, body)
    headers = mergeHeaders(defaultHeaders(), input.headers)
    const mergedOptions: RequestInfo = { ...defaultRequestOptions(), ...input }

    // @ts-expect-error
    if (_isGetRequest) delete mergedOptions.body

    // @ts-expect-error this.url is really a URL, but typescript seems to think Request cant handle it.
    request = new Request(url, mergedOptions)
  } else {
    method = getMethod(options)
    _isGetRequest = isGetRequest(method)
    body = getBody(options)
    url = getUrl(input, _isGetRequest, body)
    headers = mergeHeaders(defaultHeaders(), new Headers(options.headers))
    const mergedOptions = { ...defaultRequestOptions(), ...options }
    mergedOptions.headers = headers

    if (_isGetRequest) delete mergedOptions.body

    // @ts-expect-error this.url is really a URL, but typescript seems to think Request cant handle it.
    request = new Request(url, mergedOptions)
  }

  headers = request.headers
  const params = url.searchParams

  return {
    request,
    method,
    url,
    body,
    params,
    abortController,
    abortSignal,
    cancel,
    isGetRequest: _isGetRequest
  }

  function defaultHeaders (): Headers {
    const headers: Headers = new Headers({
      Accept: '*/*',
      'X-REQUESTED-WITH': 'XmlHttpRequest'
    })

    const token = getToken()

    if (token != null) {
      headers.set('X-CSRF-TOKEN', token)
    }

    return headers
  }

  function cancel (event?: CustomEvent): void {
    abortController.abort()

    // trigger event dispatching if an event gets passed in.
    if (event != null) {
      stopEverything(event)

      const { element } = event.detail

      dispatch.call(element, AJAX_EVENTS.ajaxStopped, {
        detail: { ...event.detail }
      })
    }
  }

  function defaultRequestOptions (): RequestInit {
    const options: RequestInit = {
      method,
      headers,
      credentials: 'same-origin',
      redirect: 'follow',
      signal: abortSignal
    }

    if (_isGetRequest) {
      return options
    }

    options.body = body
    return options
  }
}

function getUrl (url: Locateable, getRequest: boolean, body: FetchRequestBody): URL {
  const location = expandUrl(url)

  if (getRequest) return location

  // Append params to the Url.
  return mergeFormDataEntries(location, entries(body))
}

function entries (body: URLSearchParams | unknown): Array<[string, FormDataEntryValue]> {
  return body instanceof URLSearchParams ? Array.from(body.entries()) : []
}

function getBody (input: Request | RequestInit): FetchRequestBody {
  return (input.body ?? new URLSearchParams()) as FetchRequestBody
}

function getMethod (input: Request | RequestInit): string {
  return (input.method?.toLowerCase() ?? 'get')
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
