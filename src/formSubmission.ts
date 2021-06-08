import { buildFormData } from './utils/form'
import { Submitter } from './types'
import { FetchRequest } from './http/fetchRequest'

type AcceptHeadersKey = '*' | 'any' | 'text' | 'html' | 'xml' | 'json'

enum FormEnctype {
  urlEncoded = 'application/x-www-form-urlencoded',
  multipart = 'multipart/form-data',
  plain = 'text/plain'
}

function formEnctypeFromString (encoding: string): FormEnctype {
  switch (encoding.toLowerCase()) {
    case FormEnctype.multipart: return FormEnctype.multipart
    case FormEnctype.plain: return FormEnctype.plain
    default: return FormEnctype.urlEncoded
  }
}

/**
 * This class handles FormSubmissions on forms that use data-remote="true"
 * This class should not be interacted with directly and instead is merely meant for
 * connecting to the DOM.
 */
export class FormSubmission {
  static acceptHeaders = {
    '*': '*/*',
    any: '*/*',
    text: 'text/plain',
    html: 'text/html',
    xml: 'application/xml, text/xml',
    json: 'application/json, text/javascript'
  }

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

    if (this.isGetRequest === false) options.body = this.body

    this.fetchRequest = new FetchRequest(this.url, options)
  }

  get request (): Request {
    return this.fetchRequest.request
  }

  /**
   * Headers to send to the request object
   */
  get headers (): Headers {
    let responseType = null

    if (this.element != null) {
      responseType = this.element.dataset.type
    }

    let acceptHeader = FormSubmission.acceptHeaders.any

    const headers = new Headers({ Accept: acceptHeader })

    // if null, just use any
    if (responseType == null) {
      return headers
    }

    responseType = responseType.trim()

    if (Object.keys(FormSubmission.acceptHeaders).includes(responseType)) {
      acceptHeader = FormSubmission.acceptHeaders[responseType as AcceptHeadersKey]
    } else {
      acceptHeader = responseType
    }

    headers.set("Accept", acceptHeader)

    return headers
  }

  /**
   * Returns properly built FormData
   */
  get formData (): FormData {
    return buildFormData(this.element, this.submitter)
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
    if (this.enctype === FormEnctype.urlEncoded || (this.isGetRequest)) {
      return new URLSearchParams(this.formDataToStrings)
    } else {
      return this.formData
    }
  }

  get isGetRequest (): boolean {
    return this.method.toLowerCase() === 'get'
  }

  get formDataToStrings (): Array<[string, string]> | undefined {
    return [...this.formData].reduce<Array<[string, string]>>((entries, [name, value]) => {
      return entries.concat(typeof value === 'string' ? [[name, value]] : [])
    }, [])
  }

  get enctype (): FormEnctype {
    const elementEncType = (this.element).enctype
    return formEnctypeFromString(this.submitter?.getAttribute('formenctype') ?? elementEncType)
  }
}
