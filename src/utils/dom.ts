// This file is copied from:
// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/dom.coffee
import { EventQueryInterface, QuerySelectorInterface, SelectorInterface } from '../types'

const m =
  Element.prototype.matches ??
  Element.prototype.webkitMatchesSelector

/**
 * Checks if the given native dom element matches the selector
 * @example
 *   match(document.querySelector("form"), { selector: "form", exclude: "form[data-remote='true']"})
 */
export function match (element: Node | Element, { selector, exclude }: SelectorInterface): boolean {
  if (!(element instanceof Element)) {
    return false
  }

  if (exclude !== undefined) {
    return m.call(element, selector) && !m.call(element, exclude)
  }

  return m.call(element, selector)
}

// data-confirm doesnt matter with Turbo.
const remoteSelector = 'a[data-remote="true"], a[data-method], form[data-remote="true"]'
const linkClickSelector = 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]'
const buttonClickSelector = 'button[data-remote]:not([form]), button[data-confirm]:not([form]), button[data-disable-with]:not([form]), button[data-disable]:not([form])'
const inputChangeSelector = 'select[data-remote], input[data-remote], textarea[data-remote]'
const formSubmitSelector = 'form'
const formInputClickSelector = 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])'

const formDisableSelector = 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled'

const formEnableSelector = 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled'

const linkDisableSelector = 'a[data-disable-with], a[data-disable]'
const buttonDisableSelector = 'button[data-disable-with], button[data-disable]'

export const BASE_SELECTORS: QuerySelectorInterface = {
  remoteSelector: { selector: remoteSelector },

  // Link elements bound by rails-ujs
  linkClickSelector: { selector: linkClickSelector },

  // Button elements bound by rails-ujs
  buttonClickSelector: {
    selector: buttonClickSelector,
    exclude: 'form button'
  },

  // Select elements bound by rails-ujs
  inputChangeSelector: { selector: inputChangeSelector },

  // Form elements bound by rails-ujs
  formSubmitSelector: { selector: formSubmitSelector },

  // Form input elements bound by rails-ujs
  formInputClickSelector: { selector: formInputClickSelector },

  // Form input elements disabled during form submission
  formDisableSelector: { selector: formDisableSelector },

  // Form input elements re-enabled after form submission
  formEnableSelector: { selector: formEnableSelector },

  // Link onClick disable selector with possible reenable after remote submission
  linkDisableSelector: { selector: linkDisableSelector },

  // Button onClick disable selector with possible reenable after remote submission
  buttonDisableSelector: { selector: buttonDisableSelector }
}

export function addListeners (conditions: EventQueryInterface[], callbacks: EventListener[]): void {
  conditions.forEach((condition) => {
    const { selectors, event } = condition

    document.querySelectorAll(selectors.join(', ')).forEach((el: Element) => {
      callbacks.forEach((callback) => el.addEventListener(event, callback))
    })
  })
}

export function removeListeners (conditions: EventQueryInterface[], callbacks: EventListener[]): void {
  conditions.forEach((condition) => {
    const { selectors, event } = condition
    const selector = selectors.join(', ')

    document.querySelectorAll(selector).forEach((el: Element) => {
      callbacks.forEach((callback) => el.addEventListener(event, callback))
    })
  })
}

export function attachObserverCallback (conditions: EventQueryInterface[], nodeList: Node[], callbacks: EventListener[]): void {
  conditions.forEach((condition) => {
    const selector = condition.selectors.join(', ')

    nodeList.forEach((node) => {
      if (match(node, { selector })) {
        callbacks.forEach((cb) => node.addEventListener(condition.event, cb))
      }

      if (node instanceof Element) {
        node.querySelectorAll(selector).forEach((el) => {
          callbacks.forEach((cb) => el.addEventListener(condition.event, cb))
        })
      }
    })
  })
}

/**
 * Helper function that returns form elements that match the specified CSS selector
 *   If form is actually a "form" element this will return associated elements outside the from that have
 *   the html form attribute set
 */
export function findFormElements (form: HTMLElement, selector: string): HTMLFormElement[] {
  if (match(form, { selector: 'form' })) {
    return Array.from((form as HTMLFormElement).elements).filter((el: Element) => match(el, { selector })) as HTMLFormElement[]
  }

  return Array.from(form.querySelectorAll(selector))
}
