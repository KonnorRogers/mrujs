import { expandUrl } from '../utils/url'
import { FetchResponseInterface } from '../types'


// Shamelessly stolen from Turbo.
// https://github.com/hotwired/turbo/blob/main/src/http/fetch_response.ts
export function FetchResponse (response: Response): FetchResponseInterface {
  let _text: string
  let _json: JSON

  const succeeded = response.ok
  const status = response.status
  const failed = !succeeded
  const clientError = (response.status >= 400 && response.status <= 499)
  const serverError = (response.status >= 500 && response.status <= 599)
  const redirected = response.redirected
  const location = expandUrl(response.url)
  const contentType = getHeader('content-type')

  const isHtml = Boolean(contentType?.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/))
  const isJson = Boolean(contentType?.toLowerCase().match(/(^application\/json|\.json)/))

  async function text (): Promise<string> {
    if (_text != null) return _text

    _text = await response.text()
    return _text
  }

  async function html (): Promise<string> {
    if (isHtml) return await text()

    return Promise.reject(response)
  }

  async function json (): Promise<JSON> {
    if (isJson) {
      if (_json != null) return _json

      _json = await response.json()
      return _json
    }

    return Promise.reject(response)
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
    response,
    status
  }
}
