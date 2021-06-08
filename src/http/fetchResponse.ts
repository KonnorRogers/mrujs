import { expandUrl } from '../utils/url'

// Shamelessly stolen from Turbo.
// https://github.com/hotwired/turbo/blob/main/src/http/fetch_response.ts
export class FetchResponse {
  readonly response: Response

  constructor (response: Response) {
    this.response = response
    console.log(this.response)
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
    return this.response.text()
  }

  get responseHtml (): Promise<string> {
    if (this.isHtml) {
      return this.response.text()
    } else {
      return Promise.reject(this.response)
    }
  }

  getHeader (name: string): string | null {
    return this.response.headers.get(name)
  }
}
