import { expandUrl } from '../utils/url'
import { FetchResponseInterface } from '../types'

// Shamelessly stolen from Turbo.
// https://github.com/hotwired/turbo/blob/main/src/http/fetch_response.ts
export function FetchResponse (response: Response): FetchResponseInterface {
  const succeeded = response.ok
  const failed = !succeeded
  const clientError = (response.status >= 400 && response.status <= 499)
  const serverError = (response.status >= 500 && response.status <= 599)
  const redirected = response.redirected
  const location = expandUrl(response.url)
  const contentType = getHeader('content-type')

  const isHtml = Boolean(contentType?.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/))
  const isJson = Boolean(contentType?.toLowerCase().match(/(^application\/json|\.json)/))

  async function text (): Promise<string> {
    return await response.text()
  }

  async function html (): Promise<string> {
    if (isHtml) return await response.text()

    return await Promise.reject(response)
  }

  async function json (): Promise<JSON> {
    if (isJson) return await response.json()

    return await Promise.reject(response)
  }

  function getHeader (name: string): string | null {
    return response.headers.get(name)
  }

  return {
    succeeded,
    failed,
    redirected,
    clientError,
    serverError,
    location,
    contentType,
    getHeader,
    isHtml,
    isJson,
    text,
    html,
    json,
    response
  }
}
