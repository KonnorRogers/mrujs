import { urlEncodeFormData } from './utils/form'
import { findResponseTypeHeader } from './utils/headers'
import { FetchRequest } from './http/fetchRequest'
import { FetchRequestInterface } from '../types'
import { expandUrl, isGetRequest } from './utils/url'

export interface MethodSubmissionInterface {
  request: Request
  fetchRequest: FetchRequestInterface
}

/**
 * This class handles data-method / data-remote submissions (<a data-remote"true">)
  */
export function MethodSubmission (element: HTMLElement): MethodSubmissionInterface {
  const method = getElementMethod(element)
  let maskedMethod

  if (window.mrujs?.maskLinkMethods) {
    maskedMethod = getMaskedMethod(method)
  }

  const href = element.getAttribute('href') ?? element.dataset.url

  if (href == null) {
    throw Error(`No 'href' or 'data-url' found on ${JSON.stringify(element)}`)
  }

  const url = expandUrl(href)

  const options: RequestInit = {
    headers: getHeaders(element)
  }

  options.method = maskedMethod ?? method
  if (!isGetRequest(method)) options.body = getBody(method, element)

  const fetchRequest = FetchRequest(url, options)

  return {
    request: fetchRequest.request,
    fetchRequest
  }
}

/**
 * Headers to send to the request object
 */
function getHeaders (element: HTMLElement | undefined): Headers {
  let responseType

  if (element != null) {
    responseType = element.dataset.type
  }

  const acceptHeader = findResponseTypeHeader(responseType)

  const headers = new Headers({ Accept: acceptHeader })

  headers.set('Accept', acceptHeader)

  return headers
}

/**
  * Returns properly built FormData
  */
function getFormData (method: string): FormData {
  const formData = new FormData()

  if (window.mrujs?.maskLinkMethods) {
    formData.append('_method', method)
  }

  return formData
}

/**
  * Finds how to send the fetch request
  * get, post, put, patch, etc
  */
function getElementMethod (element: HTMLElement): string {
  const method = element.dataset.method ?? 'get'
  return method.toLowerCase()
}

/**
  * If its a get request, leave it, everything else is masked as a POST.
  */
function getMaskedMethod (method: string): string {
  return isGetRequest(method) ? 'get' : 'post'
}

function getBody (method: string, element: HTMLElement): URLSearchParams {
  const encodedFormData = urlEncodeFormData(getFormData(method))

  // add input's name and value to submission
  const elName = element.getAttribute('name')

  // cast to HTMLInputElement to make TS happy.
  const elValue = (element as HTMLInputElement).value
  if (elName != null && elValue != null) encodedFormData.append(elName, elValue)

  const additionalParams = parseParams(element.getAttribute('data-params'))
  if (additionalParams == null) return encodedFormData

  for (const [key, value] of additionalParams) {
    if (value == null) continue

    const val = (value as any).toString()

    // Only strings can be added to UrlSearchParams
    const isString = (typeof val === 'string' || val instanceof String)
    if (!isString) continue

    encodedFormData.append(key, val.toString())
  }

  return encodedFormData
}

function parseParams (params: string | null | undefined): IterableIterator<[string, string]> | Array<[string, unknown]> | undefined {
  if (params == null) return undefined

  // convert encoded params to decoded params
  if (containsEncodedComponents(params)) {
    params = decodeURIComponent(params)
  }

  // json format
  try { return Object.entries(JSON.parse(params)) } catch { }

  // param string format
  try { return new URLSearchParams(params).entries() } catch { }

  return undefined
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
function containsEncodedComponents (x: any): boolean {
  // ie ?,=,&,/ etc
  return (decodeURI(x) !== decodeURIComponent(x))
}
