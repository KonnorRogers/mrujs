import { buildFormElementFormData, formEnctypeFromString, FormEncType } from './utils/form'
import { findResponseTypeHeader } from './utils/headers'
import { Submitter } from './types'
import { FetchRequest } from './http/fetchRequest'

/**
 * This class handles FormSubmissions on forms that use data-remote="true"
 * This class should not be interacted with directly and instead is merely meant for
 * connecting to the DOM.
 */
export class FormSubmission {
  submitter: Submitter | undefined
  element: HTMLFormElement
  fetchRequest: FetchRequest

  constructor (element: HTMLFormElement, submitter?: Submitter) {
    this.element = element

    if (submitter != null) {
      this.submitter = submitter
    }

    const options: RequestInit = {
      method: this.method,
      headers: this.headers
    }

    if (!this.isGetRequest) options.body = this.body

    this.fetchRequest = new FetchRequest(this.url, options)
  }

  get request (): Request {
    return this.fetchRequest.request
  }

  /**
   * Headers to send to the request object
   */
  get headers (): Headers {
    let responseType

    if (this.element != null) {
      responseType = this.element.dataset.type
    }

    const acceptHeader = findResponseTypeHeader(responseType)

    const headers = new Headers({ Accept: acceptHeader })

    headers.set('Accept', acceptHeader)

    return headers
  }

  /**
   * Returns properly built FormData
   */
  get formData (): FormData {
    return buildFormElementFormData(this.element, this.submitter)
  }

  /**
   * Finds how to send the fetch request
   * get, post, put, patch, etc
   */
  get method (): string {
    const method = this.submitter?.getAttribute('formmethod') ?? this.element.getAttribute('method') ?? 'get'
    return method.toLowerCase()
  }

  get action (): string {
    return this.submitter?.getAttribute('formaction') ?? this.element.action
  }

  /**
   * URL to send to. Is pulled from action=""
   * Throws an error of action="" is not defined on an element.
   */
  get url (): URL {
    return new URL(this.action)
  }

  get body (): URLSearchParams | FormData {
    if (this.enctype === FormEncType.urlEncoded || (this.isGetRequest)) {
      return window.mrujs.urlEncodeFormData(this.formData)
    } else {
      return this.formData
    }
  }

  get isGetRequest (): boolean {
    return this.method.toLowerCase() === 'get'
  }

  get enctype (): FormEncType {
    const elementEncType = (this.element).enctype
    return formEnctypeFromString(this.submitter?.getAttribute('formenctype') ?? elementEncType)
  }
}
