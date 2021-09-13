import { MimeTypeInterface } from '../types'

export const BASE_ACCEPT_HEADERS: MimeTypeInterface = {
  '*': '*/*',
  any: '*/*',
  text: 'text/plain',
  html: 'text/html',
  xml: 'application/xml, text/xml',
  json: 'application/json, text/javascript',
  script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
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
    responseType = acceptHeaders[responseType]
  }

  if (responseType.includes('*/*')) return responseType

  return `${responseType}, */*; q=0.01`
}
