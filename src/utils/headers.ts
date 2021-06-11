export const ACCEPT_HEADERS = {
  '*': '*/*',
  any: '*/*',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml, text/xml',
  json: 'application/json, text/javascript'
}

export type AcceptHeadersType = '*' | 'any' | 'text' | 'html' | 'xml' | 'json'

export function findResponseTypeHeader (responseType: string | undefined): string {
  if (responseType == null) {
    return ACCEPT_HEADERS.any
  }

  responseType = responseType.trim()

  if (Object.keys(ACCEPT_HEADERS).includes(responseType)) {
    return ACCEPT_HEADERS[responseType as AcceptHeadersType]
  }

  return responseType
}
