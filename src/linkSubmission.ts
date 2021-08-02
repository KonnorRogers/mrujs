import { formDataToStrings, FormEncType } from './utils/form'
import { findResponseTypeHeader } from './utils/headers'
import { FetchRequest } from './http/fetchRequest'

/**
 * This class handles LinkSubmissions (<a data-remote"true">)
  */
export class LinkSubmission {
  element: HTMLAnchorElement
  fetchRequest: FetchRequest

  constructor (element: HTMLAnchorElement) {
    this.element = element

    let method = this.method

    if (window.mrujs.config.maskLinkMethods) {
      method = this.maskMethod
    }

    const options: RequestInit = {
      method,
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
    const formData = new FormData()
    formData.append('_method', this.method)
    return formData
  }

  /**
   * Finds how to send the fetch request
   * get, post, put, patch, etc
   */
  get method (): string {
    const method = this.element.dataset.method ?? 'get'
    return method.toLowerCase()
  }

  /**
   * If its a get request, leave it, everything else is masked as a POST.
   */
  get maskMethod (): string {
    return this.isGetRequest ? 'get' : 'post'
  }

  get href (): string {
    return this.element.href
  }

  /**
   * URL to send to. Is pulled from action=""
   * Throws an error of action="" is not defined on an element.
   */
  get url (): URL {
    return new URL(this.href)
  }

  get body (): URLSearchParams | FormData {
    if (this.enctype === FormEncType.urlEncoded || (this.isGetRequest)) {
      return new URLSearchParams(formDataToStrings(this.formData))
    } else {
      return this.formData
    }
  }

  get isGetRequest (): boolean {
    return this.method.toLowerCase() === 'get'
  }

  get enctype (): FormEncType {
    return FormEncType.urlEncoded
  }
}
