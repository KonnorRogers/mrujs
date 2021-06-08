import { AJAX_EVENTS, dispatch } from './utils/events'
import { findSubmitter, ExtendedSubmitEvent } from './submitToggle'
import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'
import { Submitter, AddOrRemoveListeners } from './types'
import { FormSubmission } from './formSubmission'

export class FormSubmitDispatcher {
  readonly __startFormSubmission__: Function
  readonly __startFetchRequest__: Function
  readonly __sendFetchRequest__: Function
  readonly __dispatchError__: Function
  readonly __dispatchComplete__: Function

  constructor () {
    this.__startFormSubmission__ = this.startFormSubmission.bind(this)
    this.__startFetchRequest__ = this.startFetchRequest.bind(this)
    this.__sendFetchRequest__ = this.sendFetchRequest.bind(this)
    this.__dispatchError__ = this.dispatchError.bind(this)
    this.__dispatchComplete__ = this.dispatchComplete.bind(this)
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
    const target = this.findTarget(event)

    if (target.dataset.remote !== 'true') return

    event.preventDefault()

    const submitter = findSubmitter(event)
    const request = new FormSubmission(target, submitter)

    dispatch.call(target, AJAX_EVENTS.ajaxBefore, {
      detail: { request: request, submitter: submitter }
    })
  }

  /**
   * Fires off a fetch request and returns the response data. Triggered by events.
   * @fires `ajax:beforeSend`
   * The request can be found via `event.detail.request`
   */
  startFetchRequest (event: CustomEvent): void {
    if (event.defaultPrevented) return

    const { request, submitter } = event.detail

    dispatch.call(this.findTarget(event), AJAX_EVENTS.ajaxBeforeSend, {
      detail: { request, submitter }
    })
  }

  async sendFetchRequest (event: CustomEvent): Promise<void> {
    if (event.defaultPrevented) return

    const target = this.findTarget(event)
    const { request, submitter } = event.detail

    try {
      const response = new FetchResponse(await window.fetch(request.request))
      this.dispatchResponse(target, request, response, submitter)
    } catch (error) {
      this.dispatchRequestError(target, request, error, submitter)
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
    if (event.defaultPrevented) return

    const { request, response, error, submitter } = event.detail

    dispatch.call(this.findTarget(event), AJAX_EVENTS.ajaxComplete, {
      detail: {
        request,
        response,
        error,
        submitter
      }
    })
  }

  /**
   * Handles FetchResponses
   * @fires `ajax:response:error` or `ajax:success` depending on if the response succeeded.
   * properties: { request, response, submitter } = event.detail
   */
  dispatchResponse (target: HTMLFormElement, request: FetchRequest, response: FetchResponse, submitter: Submitter): void {
    if (response.succeeded) {
      dispatch.call(target, AJAX_EVENTS.ajaxSuccess, {
        detail: { request, response, submitter }
      })
      return
    }

    // Response errors, >= 400 responses
    dispatch.call(target, AJAX_EVENTS.ajaxResponseError, {
      detail: { request, response, submitter }
    })
  }

  /**
   * Handles a `fetch()` request error.
   * @fires `ajax:request:error`
   * properties: `{ request, error, submitter } = event.detail`
   */
  dispatchRequestError (target: HTMLFormElement, request: FetchRequest, error: string, submitter: Submitter): void {
    dispatch.call(target, AJAX_EVENTS.ajaxRequestError, {
      detail: { request, error, submitter }
    })
  }

  /**
   * @fires the `ajax:error` event which is a catchall for request + response errors.
   * { response, request?, error?, submitter } = event.detail
   */
  dispatchError (event: CustomEvent): void {
    if (event.defaultPrevented) return

    dispatch.call(this.findTarget(event), AJAX_EVENTS.ajaxError, {
      detail: {
        request: event.detail.request,
        response: event.detail.response,
        error: event.detail.error,
        submitter: event.detail.submitter
      }
    })
  }

  /**
   * dispatches a given event in the context of `this.element`
   */
  private listeners (fn: AddOrRemoveListeners): void {
    document[fn]('submit', this.__startFormSubmission__ as EventListener) // fires ajaxBefore
    document[fn](AJAX_EVENTS.ajaxBefore, this.__startFetchRequest__ as EventListener) // fires ajaxBeforeSend

    // fires ajaxRequestError || ajaxSuccess || ajaxResponse
    document[fn](AJAX_EVENTS.ajaxBeforeSend, this.__sendFetchRequest__ as EventListener)
    document[fn](AJAX_EVENTS.ajaxSuccess, this.__dispatchComplete__ as EventListener)
    document[fn](AJAX_EVENTS.ajaxRequestError, this.__dispatchError__ as EventListener)
    document[fn](AJAX_EVENTS.ajaxResponseError, this.__dispatchError__ as EventListener)
    document[fn](AJAX_EVENTS.ajaxError, this.__dispatchComplete__ as EventListener)
  }

  private findTarget (event: CustomEvent): HTMLFormElement {
    return event.target as HTMLFormElement
  }
}
