import { FetchResponse } from "./fetchResponse"
import { dispatch } from "../utils/events"
import { expandUrl, Locateable } from '../utils/url'

export type FetchRequestBody = FormData | URLSearchParams
export type FetchRequestHeaders = { [header: string]: string }

export class FetchRequest {
  readonly method: FetchMethod
  readonly headers: FetchRequestHeaders
  readonly url: URL
  readonly body?: FetchRequestBody
  readonly abortController = new AbortController()

  constructor(url: Locateable, { method, body = new URLSearchParams() }: RequestInit) {
    this.url = expandUrl(request.url)
    this.method = verifyMethod(method)
    this.headers = { ...this.defaultHeaders, ...headers }

    if (this.isGetRequest) {
      this.url = mergeFormDataEntries(this.url, [ ...body.entries() ])
    } else {
      this.body = body
      this.url = location
    }
  }

  get params(): URLSearchParams {
    return this.url.searchParams
  }

  get entries() {
    return this.body ? Array.from(this.body.entries()) : []
  }

  cancel() {
    this.abortController.abort()
  }

  async perform(): Promise<FetchResponse> {
    const { fetchOptions } = this
    this.delegate.prepareHeadersForRequest?.(this.headers, this)
    dispatch("turbo:before-fetch-request", { detail: { fetchOptions } })
    try {
      this.delegate.requestStarted(this)
      const response = await fetch(this.url.href, fetchOptions)
      return await this.receive(response)
    } catch (error) {
      this.delegate.requestErrored(this, error)
      throw error
    } finally {
      this.delegate.requestFinished(this)
    }
  }

  async receive(response: Response): Promise<FetchResponse> {
    const fetchResponse = new FetchResponse(response)
    const event = dispatch("turbo:before-fetch-response", { cancelable: true, detail: { fetchResponse } })
    if (event.defaultPrevented) {
      this.delegate.requestPreventedHandlingResponse(this, fetchResponse)
    } else if (fetchResponse.succeeded) {
      this.delegate.requestSucceededWithResponse(this, fetchResponse)
    } else {
      this.delegate.requestFailedWithResponse(this, fetchResponse)
    }
    return fetchResponse
  }

  get fetchOptions(): RequestInit {
    return {
      method: FetchMethod[this.method].toUpperCase(),
      credentials: "same-origin",
      headers: this.headers,
      redirect: "follow",
      body: this.body,
      signal: this.abortSignal
    }
  }

  get defaultHeaders() {
    return {
      "Accept": "text/html, application/xhtml+xml"
    }
  }

  get isGetRequest() {
    return this.method == FetchMethod.get
  }

  get abortSignal() {
    return this.abortController.signal
  }
}

function mergeFormDataEntries(url: URL, entries: [string, FormDataEntryValue][]): URL {
  const currentSearchParams = new URLSearchParams(url.search)

  for (const [ name, value ] of entries) {
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
