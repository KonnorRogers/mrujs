import { matches } from './dom'
import { SelectorType } from '../../types'

export const EVENT_DEFAULTS = {
  bubbles: true,
  cancelable: true
}

/**
 * Thin wrapper around element.dispatchEvent and new CustomEvent
 */
export function dispatch (this: Node | EventTarget, name: string, options: CustomEventInit = {}): CustomEvent {
  const event = new CustomEvent(name, { ...EVENT_DEFAULTS, ...options })
  this.dispatchEvent(event)
  return event
}

/**
 * Backwards compatibility function that hooks into dispatch.
 */
export function fire (element: EventTarget, name: string, options: CustomEventInit = {}): boolean {
  const event = dispatch.call(element, name, options)
  return !event.defaultPrevented
}

export function stopEverything (event: Event | CustomEvent): void {
  if (event.target != null) fire(event.target, 'ujs:everythingStopped')
  event.stopPropagation()
  event.stopImmediatePropagation()
  event.preventDefault()
}

const prefix = 'ajax'

export const AJAX_EVENTS = {
  /**
   * Before the ajax event gets sent.
   * You can view what data will be sent via: `event.detail.formData`
   */
  ajaxBefore: `${prefix}:before`,

  /**
   * Just prior to sending the fetch request
   */
  ajaxBeforeSend: `${prefix}:beforeSend`,

  /**
   * When the fetch request is sent. You can view whats being sent via:
   * `event.detail.formData`
   */
  ajaxSend: `${prefix}:send`,

  /**
   * When a response error occurs. IE: 400, 404, 422, 500, etc (any status code not between 200 - 299)
   * The response error can be viewed via: `event.detail.response`
   */
  ajaxResponseError: `${prefix}:response:error`,

  /**
   * Catches errors with requests such as Network errors.
   */
  ajaxRequestError: `${prefix}:request:error`,

  /**
   * When a >= 200 and <= 299 response is returned
   * You can view the full response via: `event.detail.response`
   */
  ajaxSuccess: `${prefix}:success`,

  /**
   * A unified event to catch both Response and Request errors.
   * You can view the error via: `event.detail.error`
   * This will also generate an error in your console.log
   */
  ajaxError: `${prefix}:error`,

  /**
   * After any fetch request, regardless of outcome
   * Does not have any accessible data besides the event itself
   */
  ajaxComplete: `${prefix}:complete`,

  ajaxStopped: `${prefix}:stopped`,

  ajaxBeforeNavigation: `${prefix}:beforeNavigation`
  // NOT CURRENTLY IMPLEMENTED
  // /**
  //  * when there are blank required fields in a form, submits anyway if stopped
  //  */
  // ajaxAbortedRequired: `${prefix}:aborted:required`,

  // /**
  //  * if there are non-blank input:file fields in a form, aborts if stopped
  //  */
  // ajaxAbortedFile: `${prefix}:aborted:file`
}

/**
 * Delegates events
 * to a specified parent `element`, which fires event `handler`
 * for the specified `selector` when an event of `eventType` is triggered
 * element::
 *   parent element that will listen for events e.g. document
 * selector::
 *   css selector; or an object that has `selector` and `exclude` properties (see: Rails.matches)
 * eventType::
 *   string representing the event e.g. 'submit', 'click'
 * handler::
 *   the event handler to be called
 */
export function delegate (element: Element, selector: SelectorType, eventType: string, handler: Function): void {
  element.addEventListener(eventType, (event) => {
    let target = event.target
    while (!(!(target instanceof Element) || matches(target, selector))) {
      target = target.parentNode
    }
    if (target instanceof Element && handler.call(target, event) === false) {
      event.preventDefault()
      event.stopPropagation()
    }
  })
};
