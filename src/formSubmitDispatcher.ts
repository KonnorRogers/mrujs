import { AJAX_EVENTS, dispatch } from './utils/events'
import { findSubmitter, ExtendedSubmitEvent } from './submitFinder'
import { FetchResponse } from './http/fetchResponse'
import { MrujsPluginInterface, AddOrRemoveListeners, AjaxEventDetail } from './types'
import { FormSubmission } from './formSubmission'
import { disableElement } from './elementDisabler'

export function FormSubmitDispatcher (): MrujsPluginInterface {
  return {
    name: 'FormSubmitDispatcher',
    connect,
    disconnect
  }
}

function connect (): void {
  attachListeners('addEventListener')
}

function disconnect (): void {
  attachListeners('removeEventListener')
}

/**
  * Basic fetch request which leverages the FetchRequest object.
  *   This is an internal fetch
  *   Appropriate headers will be set for you but can be overriden.
  * @fires `ajax:before`
  */
function startFormSubmission (event: ExtendedSubmitEvent): void {
  // If it doesnt have remote="true"...forget about it!
  const element = findTarget(event)

  if (element.dataset.remote !== 'true') return

  event.preventDefault()

  const submitter = findSubmitter(event)

  if (submitter != null) {
    disableElement(submitter)
  }

  const { fetchRequest, request } = FormSubmission(element, submitter)
  const detail: AjaxEventDetail = { element, fetchRequest, request, submitter }

  dispatch.call(element, AJAX_EVENTS.ajaxBefore, { detail })
}

/**
  * Fires off a fetch request and returns the response data. Triggered by events.
  * @fires `ajax:beforeSend`
  * The request can be found via `event.detail.request`
  */
function startFetchRequest (event: CustomEvent): void {
  if (event.defaultPrevented) {
    dispatchStopped(event)
    return
  }

  const { element, fetchRequest, request, submitter }: AjaxEventDetail = event.detail

  dispatch.call(element, AJAX_EVENTS.ajaxBeforeSend, {
    detail: { element, fetchRequest, request, submitter }
  })
}

function sendFetchRequest (event: CustomEvent): void {
  if (event.defaultPrevented) {
    dispatchStopped(event)
    return
  }

  const { request } = event.detail

  window.fetch(request).then((resp) => {
    const fetchResponse = new FetchResponse(resp)
    const { response } = fetchResponse
    dispatchResponse({ ...event.detail, fetchResponse, response })
  }).catch((error) => dispatchRequestError({ ...event.detail, error }))
}

/**
  * Handles FetchResponses
  *   Fires `ajax:response:error` or `ajax:success` depending on the response.
  *   You can find the response in `event.detail.response`

/*
  * Dispatches the `ajax:complete` event.
  * { response, request?, error?, submitter } = detail
  */
function dispatchComplete (event: CustomEvent): void {
  if (event.defaultPrevented) {
    dispatchStopped(event)
    return
  }

  dispatch.call(findTarget(event), AJAX_EVENTS.ajaxComplete, {
    detail: { ...event.detail }
  })
}

/**
  * Handles FetchResponses
  * @fires `ajax:response:error` or `ajax:success` depending on if the response succeeded.
  * properties: { request, response, submitter } = event.detail
  */
function dispatchResponse ({ element, fetchRequest, request, fetchResponse, response, submitter }: AjaxEventDetail): void {
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
function dispatchRequestError ({ element, fetchRequest, request, error, submitter }: AjaxEventDetail): void {
  dispatch.call(element, AJAX_EVENTS.ajaxRequestError, {
    detail: { element, fetchRequest, request, error, submitter }
  })
}

/**
  * @fires the `ajax:error` event which is a catchall for request + response errors.
  * { response, request?, error?, submitter } = event.detail
  */
function dispatchError (event: CustomEvent): void {
  if (event.defaultPrevented) {
    dispatchStopped(event)
    return
  }

  dispatch.call(findTarget(event), AJAX_EVENTS.ajaxError, {
    detail: { ...event.detail }
  })
}

// This is only for when event.defaultPrevented() is called.
// if a user calls `event.detail.submission.cancel()`, that will be triggered separately.
function dispatchStopped (event: CustomEvent): void {
  dispatch.call(findTarget(event), AJAX_EVENTS.ajaxStopped, {
    detail: { ...event.detail }
  })
}

/**
  * dispatches a given event in the context of `element`
  */
function attachListeners (fn: AddOrRemoveListeners): void {
  document[fn]('submit', startFormSubmission as EventListener) // fires ajaxBefore
  document[fn](AJAX_EVENTS.ajaxBefore, startFetchRequest as EventListener) // fires ajaxBeforeSend

  // fires ajaxRequestError || ajaxSuccess || ajaxResponse
  document[fn](AJAX_EVENTS.ajaxBeforeSend, sendFetchRequest as EventListener)
  document[fn](AJAX_EVENTS.ajaxSuccess, dispatchComplete as EventListener)
  document[fn](AJAX_EVENTS.ajaxRequestError, dispatchError as EventListener)
  document[fn](AJAX_EVENTS.ajaxResponseError, dispatchError as EventListener)
  document[fn](AJAX_EVENTS.ajaxError, dispatchComplete as EventListener)
}

function findTarget (event: CustomEvent): HTMLFormElement {
  return event.target as HTMLFormElement
}
