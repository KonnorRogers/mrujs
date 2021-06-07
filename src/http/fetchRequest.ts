import { FetchResponse } from "./fetchResponse"
import { dispatch } from "../utils/events"
import { expandUrl, Locateable } from '../utils/url'

export type FetchRequestBody = URLSearchParams | ReadableStream<Uint8Array>
export type FetchRequestHeaders = { [header: string]: string }
export type FetchMethodString = "get" | "put" | "post" | "patch" | "delete"

export class FetchRequest {
  abortController = new AbortController()
  body?: FetchRequestBody
  headers!: Headers
  method!: FetchMethodString
  request: Request
  url: URL

  constructor(input: Request & Locateable, options: RequestInit = {}) {
    this.url = expandUrl(input.url || input)

    // if we're given a Request, set the method, headers and body first, then we
    // merge with the defaultRequestOptions and clone the instance of Request
    if (input instanceof Request) {
      this.setMethodHeadersAndBody(input)
      this.request = new Request({ ...this.defaultRequestOptions, ...input as Request })
    } else {
      // @ts-expect-error this.url is really a URL, but typescript seems to think Request cant handle it.
      this.request = new Request(this.url, {...this.defaultRequestOptions, ...options})
      this.setMethodHeadersAndBody(this.request)
    }

    this.modifyUrl()
  }

  get params(): URLSearchParams {
    return this.url.searchParams
  }

  get entries(): [string, FormDataEntryValue][] {
    return this.body instanceof URLSearchParams ? Array.from(this.body.entries()) : []
  }

  cancel() {
    this.abortController.abort()
  }

  modifyUrl(): void {
    if (!this.isGetRequest) return

    // Append params to the Url.
    this.url = mergeFormDataEntries(this.url, this.entries)
  }

  setMethodHeadersAndBody(input: Request): void {
    this.method = input.method.toLowerCase() as FetchMethodString
    this.headers = { ...this.defaultHeaders, ...input.headers }
    this.body = input.body || new URLSearchParams()
  }

  get defaultRequestOptions(): RequestInit {
    return {
      method: this.method.toUpperCase(),
      credentials: "same-origin",
      headers: this.headers,
      redirect: "follow",
      body: this.body,
      signal: this.abortSignal
    }
  }

  get defaultHeaders() {
    return {
      "Accept": "*/*"
    }
  }

  get isGetRequest() {
    return this.method == "get"
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
