import { MimeTypeInterface } from '../types'

export const BASE_ACCEPT_HEADERS: MimeTypeInterface = {
  '*': '*/*',
  any: '*/*',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml, text/xml',
  json: 'application/json, text/javascript'
}

export function findResponseTypeHeader (responseType: string | undefined): string {
  const acceptHeaders = {
    ...window.mrujs.mimeTypes
  }

  if (responseType == null) {
    return acceptHeaders.any
  }

  responseType = responseType.trim()

  if (Object.keys(acceptHeaders).includes(responseType)) {
    return acceptHeaders[responseType]
  }

  return responseType
}
