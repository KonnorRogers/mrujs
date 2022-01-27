import { buildFormElementFormData, formEnctypeFromString, FormEncType, FormEncTypes, urlEncodeFormData } from './utils/form'
import { findResponseTypeHeader } from './utils/headers'
import { FetchRequestInterface, Submitter } from './types'
import { FetchRequest } from './http/fetchRequest'
import { isGetRequest, expandUrl } from './utils/url'

export interface FormSubmissionInterface {
  fetchRequest: FetchRequestInterface
  request: Request
  element: HTMLFormElement
  submitter?: Submitter
}

/**
 * This handles FormSubmissions on forms that use data-remote="true"
 * This should not be interacted with directly and instead is merely meant for
 * connecting to the DOM.
 */
export function FormSubmission (element: HTMLFormElement, submitter?: Submitter): FormSubmissionInterface {
  const url = expandUrl(getAction(element, submitter))
  const options = getOptions(element, submitter)
  const fetchRequest = FetchRequest(url, options)
  const request = fetchRequest.request

  return {
    fetchRequest,
    request,
    element,
    submitter
  }
}

function getOptions (element: HTMLFormElement, submitter?: Submitter): RequestInit {
  const method = getMethod(element, submitter)
  const headers = getHeaders(element)

  const options: RequestInit = {
    method,
    headers
  }

  // Will get stripped out by FetchRequest if its a GET request.
  options.body = getBody(element, method, submitter)

  return options
}

/**
  * Headers to send to the request object
  */
function getHeaders (element?: HTMLFormElement): Headers {
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
function getFormData (element: HTMLFormElement, submitter?: Submitter): FormData {
  return buildFormElementFormData(element, submitter)
}

/**
  * Finds how to send the fetch request
  * get, post, put, patch, etc
  */
function getMethod (element: HTMLFormElement, submitter?: Submitter): string {
  const method = submitter?.getAttribute('formmethod') ?? element.getAttribute('method') ?? 'get'
  return method.toLowerCase()
}

function getAction (element: HTMLElement, submitter?: Submitter): string {
  const action = submitter?.getAttribute('formaction') ?? element.getAttribute('action') ?? ''
  return action
}

function getBody (element: HTMLFormElement, method: string, submitter?: Submitter): URLSearchParams | FormData {
  const formData = getFormData(element, submitter)

  if (getEncType(element, submitter) === FormEncTypes.urlEncoded || (isGetRequest(method))) {
    return urlEncodeFormData(formData)
  } else {
    return formData
  }
}

function getEncType (element: HTMLElement, submitter?: Submitter): FormEncType {
  const elementEncType = element.getAttribute('enctype')
  const encType = submitter?.getAttribute('formenctype') ?? elementEncType ?? FormEncTypes.urlEncoded
  const encString = formEnctypeFromString(encType)
  return encString
}
