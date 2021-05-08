import { dispatch, EVENT_DEFAULTS, AJAX_EVENTS } from './utils/events'
import { findSubmitter, ExtendedSubmitEvent } from './submitToggle'
import { Csrf } from './csrf'

type AcceptHeadersKey = '*' | 'any' | 'text' | 'html' | 'xml' | 'json'

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

  csrfToken: string
  submitter!: HTMLInputElement
  element!: HTMLFormElement | null

  constructor () {
    this.csrfToken = new Csrf().token
  }

  connect (): void {
    // Picks up the submit event
    document.addEventListener('submit', this._ajaxSubmit.bind(this) as EventListener)

    // Dispatchs an `ajax:before` event, which then triggers a fetch request
    document.addEventListener(
      AJAX_EVENTS.ajaxBefore,
      this._sendFetchRequest.bind(this) as EventListener)

    // Listen for all 3 possible response and then send out a complete event
    document.addEventListener(
      AJAX_EVENTS.ajaxSuccess,
      this._dispatchComplete.bind(this) as EventListener)

    document.addEventListener(
      AJAX_EVENTS.ajaxResponseError,
      this._dispatchComplete.bind(this) as EventListener)

    document.addEventListener(
      AJAX_EVENTS.ajaxError,
      this._dispatchComplete.bind(this) as EventListener)
  }

  disconnect (): void {
    document.removeEventListener('submit', this._ajaxSubmit.bind(this) as EventListener)

    document.removeEventListener(
      AJAX_EVENTS.ajaxBefore,
      this._sendFetchRequest.bind(this) as EventListener)

    document.removeEventListener(
      AJAX_EVENTS.ajaxSuccess,
      this._dispatchComplete.bind(this) as EventListener)

    document.removeEventListener(
      AJAX_EVENTS.ajaxResponseError,
      this._dispatchComplete.bind(this) as EventListener)

    document.removeEventListener(
      AJAX_EVENTS.ajaxError,
      this._dispatchComplete.bind(this) as EventListener)
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
    event.stopPropagation()

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

    this._dispatch(AJAX_EVENTS.ajaxComplete, {
      detail: { submitter: this.submitter }
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
  get headers (): Headers {
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

    return new Headers({
      Accept: acceptHeader,
      'X-CSRF-TOKEN': this.csrfToken
    })
  }

  /**
   * A request object to be passed to fetch
   */
  get request (): ExtendedRequestInit {
    const requestOptions: RequestInit = {
      method: this.method,
      headers: { ...this.headers },
      redirect: 'follow'
    }

    const disallowedBodyRequests = ['get', 'head']

    if (!disallowedBodyRequests.includes(this.method.toLowerCase())) {
      requestOptions.body = JSON.stringify(this.formData)
    }

    return { ...requestOptions, url: this.url }
  }

  /**
   * Serializes the formdata in of the form
   */
  get formData (): FormData | null {
    if (this.element == null) {
      return null
    }

    return new FormData(this.element)
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
  get url (): string {
    const url = this.element?.action

    if (url == null) {
      throw new Error(
        `${JSON.stringify(this.element)} does not have an "action" attribute set. Aborting...`
      )
    }

    return url
  }
}
