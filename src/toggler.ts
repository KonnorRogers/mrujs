import { match, linkDisableSelector, buttonDisableSelector, formEnableSelector, formSubmitSelector } from './utils/dom'
import { stopEverything } from './utils/events'

/**
 * Disables buttons / links / forms on submission start
 *   and reenables them when ajax:stopped or ajax:complete is fired.
 */
export class Toggler {
  connect (): void {

  }

  disconnect (): void {

  }

  // Unified function to enable an element (link, button and form)
  enableElement(trigger: Event | HTMLElement): void {
    let element = trigger as HTMLElement

    if (trigger instanceof Event) {
      // return if isXhrRedirect(e)
      element = trigger.target as HTMLElement
    }

    if (match(element, linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, buttonDisableSelector) || match(element, formEnableSelector)) {
      this.enableFormElement(element)
      return
    }

    if (match(element, formSubmitSelector)) {
      this.enableFormElements(element)
    }
  }

  /**
   * Replace element's html with the 'data-disable-with' after storing original html
   *   and prevent clicking on it
   */
  disableLinkElement (element: HTMLElement): void {
    if (element.dataset["ujs:disabled"] != null) return

    let replacement = element.dataset.disableWith

    // Perhaps morph here instead??
    if (replacement != null) {
      element.dataset['ujs:enable-with'] = element.innerHTML
      element.innerHTML = replacement
    }

    element.addEventListener('click', stopEverything) // prevent further clicking
    element.dataset['ujs:disabled'] = "true"
  }

// # Restore element to its original state which was disabled by 'disableLinkElement' above
// enableLinkElement = (element) ->
//   originalText = getData(element, 'ujs:enable-with')
//   if originalText?
//     element.innerHTML = originalText # set to old enabled state
//     setData(element, 'ujs:enable-with', null) # clean up cache
//   element.removeEventListener('click', stopEverything) # enable element
//   setData(element, 'ujs:disabled', null)

// # Disables form elements:
// #  - Caches element value in 'ujs:enable-with' data store
// #  - Replaces element text with value of 'data-disable-with' attribute
// #  - Sets disabled property to true
// disableFormElements = (form) ->
//   formElements(form, Rails.formDisableSelector).forEach(disableFormElement)

// disableFormElement = (element) ->
//   return if getData(element, 'ujs:disabled')
//   replacement = element.getAttribute('data-disable-with')
//   if replacement?
//     if matches(element, 'button')
//       setData(element, 'ujs:enable-with', element.innerHTML)
//       element.innerHTML = replacement
//     else
//       setData(element, 'ujs:enable-with', element.value)
//       element.value = replacement
//   element.disabled = true
//   setData(element, 'ujs:disabled', true)

// # Re-enables disabled form elements:
// #  - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
// #  - Sets disabled property to false
// enableFormElements = (form) ->
//   formElements(form, Rails.formEnableSelector).forEach(enableFormElement)

// enableFormElement = (element) ->
//   originalText = getData(element, 'ujs:enable-with')
//   if originalText?
//     if matches(element, 'button')
//       element.innerHTML = originalText
//     else
//       element.value = originalText
//     setData(element, 'ujs:enable-with', null) # clean up cache
//   element.disabled = false
//   setData(element, 'ujs:disabled', null)
}
