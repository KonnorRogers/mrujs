import { dispatch, EVENT_DEFAULTS, AJAX_EVENTS } from './utils/events'
import { findSubmitter, ExtendedSubmitEvent } from './submitToggle'
import { Utils } from './utils'

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

export interface ExtendedRequestInit extends RequestInit {
  url?: string
  dispatchEvents?: boolean
}

export class Ajax {
  static acceptHeaders = {
    '*': '*/*',
    any: '*/*',
    text: 'text/plain',
    html: 'text/html',
    xml: 'application/xml, text/xml',
    json: 'application/json, text/javascript'
  }

  submitter!: HTMLInputElement
  element!: HTMLFormElement | null

  __ajaxSubmit__!: Function
  __sendFetchRequest__!: Function
  __dispatchComplete__!: Function

  connect (): void {
    this.__ajaxSubmit__ = this._ajaxSubmit.bind(this)
    this.__sendFetchRequest__ = this._sendFetchRequest.bind(this)
    this.__dispatchComplete__ = this._dispatchComplete.bind(this)

    // Picks up the submit event
    document.addEventListener('submit', this.__ajaxSubmit__ as EventListener)

    // Dispatchs an `ajax:before` event, which then triggers a fetch request
    document.addEventListener(
      AJAX_EVENTS.ajaxBefore,
      this.__sendFetchRequest__ as EventListener)

    // Listen for all 3 possible response and then send out a complete event
    document.addEventListener(
      AJAX_EVENTS.ajaxSuccess,
      this.__dispatchComplete__ as EventListener)

    document.addEventListener(
      AJAX_EVENTS.ajaxResponseError,
      this.__dispatchComplete__ as EventListener)

    document.addEventListener(
      AJAX_EVENTS.ajaxError,
      this.__dispatchComplete__ as EventListener)
  }

  disconnect (): void {
    // Picks up the submit event
    document.removeEventListener('submit', this.__ajaxSubmit__ as EventListener)

    // Dispatchs an `ajax:before` event, which then triggers a fetch request
    document.removeEventListener(
      AJAX_EVENTS.ajaxBefore,
      this.__sendFetchRequest__ as EventListener)

    // Listen for all 3 possible response and then send out a complete event
    document.removeEventListener(
      AJAX_EVENTS.ajaxSuccess,
      this.__dispatchComplete__ as EventListener)

    document.removeEventListener(
      AJAX_EVENTS.ajaxResponseError,
      this.__dispatchComplete__ as EventListener)

    document.removeEventListener(
      AJAX_EVENTS.ajaxError,
      this.__dispatchComplete__ as EventListener)
  }

  /**
   * Basic fetch request. Takes in simple object ({}) and convert it to a Request Object.
   * `ajax:before` event request data can be found with `event.detail.request`
   * @fires ajax:before
   * @example
   *   Ajax.fetch({
   *     url: "/myurl",
   *     headers: {
   *       // ...
   *     },
   *     redirect: "follow",
   *   })
   * Appropriate headers will be set for you but can be overriden.
   */
  fetch (request: ExtendedRequestInit): Promise<Response> | null {
    if (request.url == null) {
      throw new Error(
        `Fetch called without a url. Aborting.\nObj given: ${JSON.stringify(request)}`
      )
    }

    const { url, dispatchEvents } = request

    delete request.url
    delete request.dispatchEvents

    const requestObj = new Request(url, request)

    // If a user sets `request.dispatchEvents = true`, go through
    // The full event lifecycle. This is generally used by remote forms.
    if (dispatchEvents === true) {
      this._dispatch(AJAX_EVENTS.ajaxBefore, {
        detail: { request: requestObj, submitter: this.submitter }
      })

      return null
    }

    return window.fetch(requestObj)
  }

  /**
   * @private
   * Triggers an ajax request from a form submit.
   */
  _ajaxSubmit (event: ExtendedSubmitEvent): void {
    // If it doesnt have remote="true"...forget about it!
    const target = event.target as HTMLFormElement

    if (target.dataset.remote !== 'true') {
      return
    }

    // Prevent default submit behavior
    event.preventDefault()

    this.element = target

    const submitter = findSubmitter(event)

    if (submitter != null) {
      this.submitter = submitter
    }

    this.fetch({ ...this.request, dispatchEvents: true }) as null
  }

  /**
   * @private
   * Fires off a fetch request and returns the response data. Triggered by events.
   * @fires ajax:send
   * The request can be found via `event.detail.request`
   */
  _sendFetchRequest (event: CustomEvent): void {
    if (event.defaultPrevented) {
      return
    }

    // disableSubmitter();

    const { request } = event.detail

    if (request.url == null) {
      throw new Error(`Fetch attempted without a url. Aborting. \n
                       Request attempted: ${JSON.stringify(request)}`)
    }

    this._dispatch(AJAX_EVENTS.ajaxSend, {
      detail: { request, submitter: this.submitter }
    })

    window
      .fetch(event.detail.request)
      .then(response => this._dispatchResponse(response))
      .catch(error => this._dispatchError(error))
  }

  /**
   * Handles a JSON based response
   *   Fires `ajax:response:error` or `ajax:success` depending on the response.
   *   You can find the response in `event.detail.response`
   */
  _dispatchResponse (response: Response): void {
    console.log("RESPONSE: ", response)
    if (response.ok) {
      this._dispatch(AJAX_EVENTS.ajaxSuccess, {
        detail: { response, submitter: this.submitter }
      })
      return
    }

    // Response errors, >= 400 responses
    this._dispatch(AJAX_EVENTS.ajaxResponseError, {
      detail: { response, submitter: this.submitter }
    })
  }

  /**
   * Handles a fetch error and fire an `ajax:error`. The error can be found in:
   * `event.detail.error` and will also issue a `console.error`
   */
  _dispatchError (error: string): void {
    this._dispatch(AJAX_EVENTS.ajaxError, {
      detail: { error, submitter: this.submitter }
    })

    /* eslint-disable no-console */
    console.error(
      `The following error was encountered during your fetch request: ${error}`
    )
    /* eslint-enable */
  }

  /*
   * @private
   * Dispatches the `ajax:complete` event. No details here!
   */
  _dispatchComplete (event: CustomEvent): void {
    if (event.defaultPrevented) {
      return
    }

    console.log("COMPLETE EVENT", event)
    this._dispatch(AJAX_EVENTS.ajaxComplete, {
      detail: {
        response: event.detail.response,
        error: event.detail.error,
        submitter: this.submitter
      }
    })
  }

  /**
   * @private
   * dispatches a given event in the context of `this.element`
   */
  _dispatch (event: string, options: CustomEventInit): void {
    const optionsWithDefaults = Object.assign(EVENT_DEFAULTS, options)

    let dispatchOn: Node = document

    if (this.element != null) {
      dispatchOn = this.element
    }

    dispatch.call(dispatchOn, event, optionsWithDefaults)
  }

  /**
   * Headers to send to the request object
   */
  get headers (): HeadersInit {
    let response = null
    if (this.element != null) {
      response = this.element.dataset.response
    }

    let acceptHeader = Ajax.acceptHeaders.any

    // if null, just use any
    if (response != null) {
      response = response.trim()

      if (Object.keys(Ajax.acceptHeaders).includes(response)) {
        const res = response as AcceptHeadersKey
        acceptHeader = Ajax.acceptHeaders[res]
      } else {
        acceptHeader = response
      }
    }

    const headers = {
      Accept: acceptHeader,
      'X-CSRF-Token': ''
    }

    if (this.method.toLowerCase() !== 'get') {
      const token = Utils.getCookieValue(Utils.getMetaContent('csrf-param')) ?? Utils.getMetaContent('csrf-token')

      if (token != null) {
        headers['X-CSRF-Token'] = token
      }
    }

    return headers
  }

  /**
   * A request object to be passed to fetch
   */
  get request (): ExtendedRequestInit {
    const requestOptions: RequestInit = {
      method: this.method,
      headers: { ...this.headers },
      redirect: 'follow',
      credentials: 'include'
    }

    if (this.method.toLowerCase() !== 'get') {
      if (this.element != null) {
        requestOptions.body = this.body
      }
    } else {
      this.url = this.mergeFormDataEntries(this.url, [...this.body.entries()])
    }

    return { ...requestOptions, url: this.url.href }
  }

  /**
   * Serializes the formdata in of the form
   */
  get formData (): FormData {
    return this.buildFormData()
  }

  /**
   * Finds how to send the fetch request
   * POST, PUT, PATCH, etc
   */
  get method (): string {
    const method = this.element?.method

    if (method == null) {
      throw new Error(
        `${JSON.stringify(this.element)} does not have a method attribute set. Aborting...`
      )
    }

    return method
  }

  /**
   * URL to send to. Is pulled from action=""
   * Throws an error of action="" is not defined on an element.
   */
  get url (): URL {
    const url = this.element?.action

    if (url == null) {
      throw new Error(
        `${JSON.stringify(this.element)} does not have an "action" attribute set. Aborting...`
      )
    }

    return new URL(url)
  }

  set url (val: URL) {
    this.url = val
  }

  get body (): URLSearchParams | FormData {
    if (this.enctype === FormEnctype.urlEncoded || (this.method.toLowerCase() === 'get')) {
      return new URLSearchParams(this.formDataToStrings)
    } else {
      return this.formData
    }
  }

  buildFormData (): FormData {
    const formData = new FormData(this.element as HTMLFormElement)
    const name = this.submitter?.getAttribute('name')
    const value = this.submitter?.getAttribute('value')

    if (name != null && value != null && formData.get(name) !== value) {
      formData.append(name, value)
    }

    return formData
  }

  get formDataToStrings (): Array<[string, string]> | undefined {
    return [...this.formData].reduce<Array<[string, string]>>((entries, [name, value]) => {
      return entries.concat(typeof value === 'string' ? [[name, value]] : [])
    }, [])
  }

  get enctype (): FormEnctype {
    const elementEncType = (this.element as HTMLFormElement).enctype
    return formEnctypeFromString(this.submitter?.getAttribute('formenctype') ?? elementEncType)
  }

  mergeFormDataEntries (url: URL, entries: Array<[string, FormDataEntryValue]>): URL {
    const currentSearchParams = new URLSearchParams(url.search)

    for (const [name, value] of entries) {
      if (value instanceof File) continue

      if (currentSearchParams.has(name)) {
        currentSearchParams.delete(name)
        url.searchParams.set(name, value)
      } else {
        url.searchParams.append(name, value)
      }
    }

    return url
  }
}
