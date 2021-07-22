import { AJAX_EVENTS, dispatch } from './utils/events'
import { findSubmitter, ExtendedSubmitEvent } from './submitFinder'
import { FetchResponse } from './http/fetchResponse'
import { AddOrRemoveListeners, AjaxEventDetail } from './types'
import { FormSubmission } from './formSubmission'

export class FormSubmitDispatcher {
  readonly boundStartFormSubmission: Function
  readonly boundStartFetchRequest: Function
  readonly boundSendFetchRequest: Function
  readonly boundDispatchError: Function
  readonly boundDispatchComplete: Function

  constructor () {
    this.boundStartFormSubmission = this.startFormSubmission.bind(this)
    this.boundStartFetchRequest = this.startFetchRequest.bind(this)
    this.boundSendFetchRequest = this.sendFetchRequest.bind(this)
    this.boundDispatchError = this.dispatchError.bind(this)
    this.boundDispatchComplete = this.dispatchComplete.bind(this)
  }

  get name (): string {
    return FormSubmitDispatcher.name
  }

  connect (): void {
    this.listeners('addEventListener')
  }

  disconnect (): void {
    this.listeners('removeEventListener')
  }

  /**
   * Basic fetch request which leverages the FetchRequest object.
   *   This is an internal fetch
   *   Appropriate headers will be set for you but can be overriden.
   * @fires `ajax:before`
   */
  startFormSubmission (event: ExtendedSubmitEvent): void {
    // If it doesnt have remote="true"...forget about it!
    const element = this.findTarget(event)

    if (element.dataset.remote !== 'true') return

    event.preventDefault()

    const submitter = findSubmitter(event)

    if (submitter != null) {
      window.mrujs.elementDisabler.disableElement(submitter)
    }

    const { fetchRequest, request } = new FormSubmission(element, submitter)
    const detail: AjaxEventDetail = { element, fetchRequest, request, submitter }

    dispatch.call(element, AJAX_EVENTS.ajaxBefore, { detail })
  }

  /**
   * Fires off a fetch request and returns the response data. Triggered by events.
   * @fires `ajax:beforeSend`
   * The request can be found via `event.detail.request`
   */
  startFetchRequest (event: CustomEvent): void {
    if (event.defaultPrevented) {
      this.dispatchStopped(event)
      return
    }

    const { element, fetchRequest, request, submitter }: AjaxEventDetail = event.detail

    dispatch.call(element, AJAX_EVENTS.ajaxBeforeSend, {
      detail: { element, fetchRequest, request, submitter }
    })
  }

  async sendFetchRequest (event: CustomEvent): Promise<void> {
    if (event.defaultPrevented) {
      this.dispatchStopped(event)
      return
    }

    const { request } = event.detail

    try {
      const fetchResponse = new FetchResponse(await window.fetch(request))
      const { response } = fetchResponse
      this.dispatchResponse({ ...event.detail, fetchResponse, response })
    } catch (error) {
      this.dispatchRequestError({ ...event.detail, error })
    }
  }

  /**
   * Handles FetchResponses
   *   Fires `ajax:response:error` or `ajax:success` depending on the response.
   *   You can find the response in `event.detail.response`

  /*
   * Dispatches the `ajax:complete` event.
   * { response, request?, error?, submitter } = detail
   */
  dispatchComplete (event: CustomEvent): void {
    if (event.defaultPrevented) {
      this.dispatchStopped(event)
      return
    }

    dispatch.call(this.findTarget(event), AJAX_EVENTS.ajaxComplete, {
      detail: { ...event.detail }
    })
  }

  /**
   * Handles FetchResponses
   * @fires `ajax:response:error` or `ajax:success` depending on if the response succeeded.
   * properties: { request, response, submitter } = event.detail
   */
  dispatchResponse ({ element, fetchRequest, request, fetchResponse, response, submitter }: AjaxEventDetail): void {
    const status = response?.status

    if (fetchResponse?.succeeded === true) {
      dispatch.call(element, AJAX_EVENTS.ajaxSuccess, {
        detail: { element, fetchRequest, request, fetchResponse, response, submitter, status }
      })
      return
    }

    // Response errors, >= 400 responses
    dispatch.call(element, AJAX_EVENTS.ajaxResponseError, {
      detail: { element, fetchRequest, request, fetchResponse, response, submitter, status }
    })
  }

  /**
   * Handles a `fetch()` request error.
   * @fires `ajax:request:error`
   * properties: `{ request, error, submitter } = event.detail`
   */
  dispatchRequestError ({ element, fetchRequest, request, error, submitter }: AjaxEventDetail): void {
    dispatch.call(element, AJAX_EVENTS.ajaxRequestError, {
      detail: { element, fetchRequest, request, error, submitter }
    })
  }

  /**
   * @fires the `ajax:error` event which is a catchall for request + response errors.
   * { response, request?, error?, submitter } = event.detail
   */
  dispatchError (event: CustomEvent): void {
    if (event.defaultPrevented) {
      this.dispatchStopped(event)
      return
    }

    dispatch.call(this.findTarget(event), AJAX_EVENTS.ajaxError, {
      detail: { ...event.detail }
    })
  }

  // This is only for when event.defaultPrevented() is called.
  // if a user calls `event.detail.submission.cancel()`, that will be triggered separately.
  dispatchStopped (event: CustomEvent): void {
    dispatch.call(this.findTarget(event), AJAX_EVENTS.ajaxStopped, {
      detail: { ...event.detail }
    })
  }

  /**
   * dispatches a given event in the context of `this.element`
   */
  private listeners (fn: AddOrRemoveListeners): void {
    document[fn]('submit', this.boundStartFormSubmission as EventListener) // fires ajaxBefore
    document[fn](AJAX_EVENTS.ajaxBefore, this.boundStartFetchRequest as EventListener) // fires ajaxBeforeSend

    // fires ajaxRequestError || ajaxSuccess || ajaxResponse
    document[fn](AJAX_EVENTS.ajaxBeforeSend, this.boundSendFetchRequest as EventListener)
    document[fn](AJAX_EVENTS.ajaxSuccess, this.boundDispatchComplete as EventListener)
    document[fn](AJAX_EVENTS.ajaxRequestError, this.boundDispatchError as EventListener)
    document[fn](AJAX_EVENTS.ajaxResponseError, this.boundDispatchError as EventListener)
    document[fn](AJAX_EVENTS.ajaxError, this.boundDispatchComplete as EventListener)
  }

  private findTarget (event: CustomEvent): HTMLFormElement {
    return event.target as HTMLFormElement
  }
}
