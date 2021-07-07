// This file is copied from:
// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/dom.coffee
import { QuerySelectorInterface, SelectorInterface } from '../types'

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

export const BASE_MODIFIERS = [
  'data-confirm',
  'data-remote',
  'data-method',
  'data-disable',
  'data-disable-with',
  'data-turbo',
  'type'
]

let form = 'form'
let link = 'a'

if (window.Turbo != null) {
  form = 'form[data-turbo=false]'
  link = 'a[data-turbo=false]'
}

// data-confirm doesnt matter with Turbo.
const linkClickSelector = `a[data-confirm], ${link}[data-method], ${link}[data-remote]:not([disabled]), a[data-disable-with], ${link}[data-disable]`
const buttonClickSelector = 'button[data-remote]:not([form]), button[data-confirm]:not([form])'
const inputChangeSelector = 'select[data-remote], input[data-remote], textarea[data-remote]'
const formSubmitSelector = `${form}`
const formInputClickSelector = 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])'

const formDisableSelector = 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled'

const formEnableSelector = 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled'

const linkDisableSelector = 'a[data-disable-with], a[data-disable]'
const buttonDisableSelector = 'button[data-remote][data-disable-with], button[data-remote][data-disable]'

export const BASE_SELECTORS: QuerySelectorInterface = {
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
