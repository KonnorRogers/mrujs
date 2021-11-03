// This file is copied from:
// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/dom.coffee
import { EventQueryInterface, QuerySelectorInterface, SelectorType } from '../../types'

export function toArray<T> (value: any): T[] {
  if (Array.isArray(value)) {
    return value
  } else if (Array.from != null) {
    return Array.from(value)
  } else {
    return [].slice.call(value)
  }
}

const m =
  Element.prototype.matches ??
  Element.prototype.webkitMatchesSelector

/**
 * Checks if the given native dom element matches the selector
 * @example
 *   matches(document.querySelector("form"), { selector: "form", exclude: "form[data-remote='true']"})
 *   matches(document.querySelector("form"), "form")
 */
export function matches (element: Node | Element, selector: SelectorType): boolean {
  if (!(element instanceof Element)) {
    return false
  }

  if (typeof selector === 'string') {
    return m.call(element, selector)
  }

  return m.call(element, selector.selector) && !m.call(element, selector.exclude)
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
  remoteSelector: `a[${remote}="true"], a[${method}], form[${remote}="true"]`,

  // Link elements bound by rails-ujs
  linkClickSelector: `a[${confirm}], ${link}[${method}], ${link}[${remote}]:not([disabled]), ${link}[${disableWith}], ${link}[${disable}]`,

  // Button elements bound by rails-ujs
  buttonClickSelector: {
    selector: `button[${remote}]:not([form]), button[${confirm}]:not([form]), button[${disableWith}]:not([form]), button[${disable}]:not([form])`,
    exclude: 'form button'
  },

  // Select elements bound by rails-ujs
  inputChangeSelector: `select[${remote}], input[${remote}], textarea[${remote}]`,

  // Form elements bound by rails-ujs
  formSubmitSelector: `${form}`,

  // Form input elements bound by rails-ujs
  formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

  // Form input elements disabled during form submission
  formDisableSelector: `input[${disableWith}]:enabled, button[${disableWith}]:enabled, textarea[${disableWith}]:enabled, input[${disable}]:enabled, button[${disable}]:enabled, textarea[${disable}]:enabled`,

  // Form input elements re-enabled after form submission
  formEnableSelector: `input[${disableWith}]:disabled, button[${disableWith}]:disabled, textarea[${disableWith}]:disabled, input[${disable}]:disabled, button[${disable}]:disabled, textarea[${disable}]:disabled`,

  // Link onClick disable selector with possible reenable after remote submission
  linkDisableSelector: `a[${disableWith}], a[${disable}]`,

  // Button onClick disable selector with possible reenable after remote submission
  buttonDisableSelector: `button[${disableWith}], button[${disable}]`,
  fileInputSelector: 'fileInputSelector: \'input[name][type=file]:not([disabled])\''
}

export function addListeners (conditions: EventQueryInterface[], callbacks: EventListener[]): void {
  conditions.forEach((condition) => {
    const { selectors, event } = condition
    const selectorString = selectors.map(selectorToString).join(', ')

    $(selectorString).forEach((el: Element) => {
      selectors.forEach((selector) => {
        if (matches(el, selector)) {
          callbacks.forEach((callback) => el.addEventListener(event, callback))
        }
      })
    })
  })
}

export function removeListeners (conditions: EventQueryInterface[], callbacks: EventListener[]): void {
  conditions.forEach((condition) => {
    const { selectors, event } = condition
    const selectorString = selectors.map(selectorToString).join(', ')

    $(selectorString).forEach((el: Element) => {
      selectors.forEach((selector) => {
        if (matches(el, selector)) {
          callbacks.forEach((callback) => el.removeEventListener(event, callback))
        }
      })
    })
  })
}

export function attachObserverCallback (conditions: EventQueryInterface[], nodeList: Node[], callbacks: EventListener[]): void {
  conditions.forEach((condition) => {
    condition.selectors.forEach((selector) => {
      nodeList.forEach((node) => {
        if (matches(node, selector)) {
          callbacks.forEach((cb) => node.addEventListener(condition.event, cb))
        }

        if (node instanceof Element) {
          node.querySelectorAll(selectorToString(selector)).forEach((el) => {
            callbacks.forEach((cb) => el.addEventListener(condition.event, cb))
          })
        }
      })
    })
  })
}

/**
 * Helper function that returns form elements that match the specified CSS selector
 *   If form is actually a "form" element this will return associated elements outside the from that have
 *   the html form attribute set
 */
export function formElements (form: HTMLElement, selector: SelectorType): HTMLFormElement[] {
  if (matches(form, 'form')) {
    return Array.from((form as HTMLFormElement).elements).filter((el: Element) => matches(el, selector)) as HTMLFormElement[]
  }

  return toArray(form.querySelectorAll(selectorToString(selector)))
}

export function $ (selector: string): Element[] {
  return toArray((document.querySelectorAll(selector)))
}

export function selectorToString (selector: SelectorType): string {
  let str
  if (typeof selector === 'string') {
    str = selector
  } else {
    str = selector.selector
  }

  return str
}
