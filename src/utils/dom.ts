// This file is copied from:
// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/dom.coffee
import { EventQueryInterface, QuerySelectorInterface, SelectorInterface } from '../../types'

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

let form = 'form'
let link = 'a'

if (window.Turbo != null) {
  form = 'form[data-turbo="false"]'
  link = 'a[data-turbo="false"]'
}

const data = 'data-'
const remote = `${data}remote`
const method = `${data}method`
const confirm = `${data}confirm`
const disable = `${data}disable`
const disableWith = `${disable}-with`

export const BASE_SELECTORS: QuerySelectorInterface = {
  remoteSelector: { selector: `a[${remote}="true"], a[${method}], form[${remote}="true"]` },

  // Link elements bound by rails-ujs
  linkClickSelector: { selector: `a[${confirm}], ${link}[${method}], ${link}[${remote}]:not([disabled]), ${link}[${disableWith}], ${link}[${disable}]` },

  // Button elements bound by rails-ujs
  buttonClickSelector: {
    selector: `button[${remote}]:not([form]), button[${confirm}]:not([form]), button[${disableWith}]:not([form]), button[${disable}]:not([form])`,
    exclude: 'form button'
  },

  // Select elements bound by rails-ujs
  inputChangeSelector: { selector: `select[${remote}], input[${remote}], textarea[${remote}]` },

  // Form elements bound by rails-ujs
  formSubmitSelector: { selector: `${form}` },

  // Form input elements bound by rails-ujs
  formInputClickSelector: { selector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])' },

  // Form input elements disabled during form submission
  formDisableSelector: { selector: `input[${disableWith}]:enabled, button[${disableWith}]:enabled, textarea[${disableWith}]:enabled, input[${disable}]:enabled, button[${disable}]:enabled, textarea[${disable}]:enabled` },

  // Form input elements re-enabled after form submission
  formEnableSelector: { selector: `input[${disableWith}]:disabled, button[${disableWith}]:disabled, textarea[${disableWith}]:disabled, input[${disable}]:disabled, button[${disable}]:disabled, textarea[${disable}]:disabled` },

  // Link onClick disable selector with possible reenable after remote submission
  linkDisableSelector: { selector: `a[${disableWith}], a[${disable}]` },

  // Button onClick disable selector with possible reenable after remote submission
  buttonDisableSelector: { selector: `button[${disableWith}], button[${disable}]` }
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
