import { urlEncodeFormData } from './utils/form'
import { findResponseTypeHeader } from './utils/headers'
import { FetchRequest } from './http/fetchRequest'
import { FetchRequestInterface } from '../types'
import { isGetRequest } from './utils/url'

export interface LinkSubmissionInterface {
  request: Request
  fetchRequest: FetchRequestInterface
}

/**
 * This class handles LinkSubmissions (<a data-remote"true">)
  */
export function LinkSubmission (element: HTMLAnchorElement): LinkSubmissionInterface {
  const method = getElementMethod(element)
  let maskedMethod

  if (window.mrujs.config.maskLinkMethods) {
    maskedMethod = getMaskedMethod(method)
  }

  const href = element.href
  const url = new URL(href)

  const options: RequestInit = {
    headers: getHeaders(element)
  }

  options.method = maskedMethod ?? method
  if (!isGetRequest(method)) options.body = getBody(method)

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

  if (window.mrujs.config.maskLinkMethods) {
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

function getBody (method: string): URLSearchParams | FormData {
  if (isGetRequest(method)) {
    return urlEncodeFormData(getFormData(method))
  } else {
    return getFormData(method)
  }
}
