import { expandUrl } from '../utils/url'

// Shamelessly stolen from Turbo.
// https://github.com/hotwired/turbo/blob/main/src/http/fetch_response.ts
export class FetchResponse {
  readonly response: Response
  private __responseHtml__!: Promise<string>
  private __responseText__!: Promise<string>
  private __responseJson__!: Promise<Record<string, unknown>>

  constructor (response: Response) {
    this.response = response
  }

  get succeeded (): boolean {
    return this.response.ok
  }

  get failed (): boolean {
    return !this.succeeded
  }

  get clientError (): boolean {
    return this.statusCode >= 400 && this.statusCode <= 499
  }

  get serverError (): boolean {
    return this.statusCode >= 500 && this.statusCode <= 599
  }

  get redirected (): boolean {
    return this.response.redirected
  }

  get location (): URL {
    return expandUrl(this.response.url)
  }

  get isHtml (): boolean {
    return Boolean(this.contentType?.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/))
  }

  get statusCode (): number {
    return this.response.status
  }

  get contentType (): string | null {
    return this.getHeader('Content-Type')
  }

  get responseText (): Promise<string> {
    if (this.__responseText__ != null) return this.__responseText__

    return (this.__responseText__ = this.response.text())
  }

  get responseHtml (): Promise<string> {
    if (this.isHtml) {
      if (this.__responseHtml__ != null) return this.__responseHtml__

      return (this.__responseHtml__ = this.responseText)
    }

    return Promise.reject(this.response)
  }

  get responseJson (): Promise<Record<string, unknown>> {
    if (this.isJson) {
      if (this.__responseJson__ != null) return this.__responseJson__

      return (this.__responseJson__ = this.response.json())
    }

    return Promise.reject(this.response)
  }

  // https://fetch.spec.whatwg.org/#fetch-api
  get isJson (): boolean {
    return Boolean(this.contentType?.toLowerCase().match(/^application\/json/))
  }

  getHeader (name: string): string | null {
    return this.response.headers.get(name)
  }
}
