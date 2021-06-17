// This file is copied from:
// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/dom.coffee

const m =
  Element.prototype.matches ??
  Element.prototype.webkitMatchesSelector

export interface SelectorInterface {
  selector: string
  exclude?: string
}
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

export const SELECTORS = {
  // Link elements bound by rails-ujs
  linkClickSelector: {
    selector:
      'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]'
  },

  // Button elements bound by rails-ujs
  buttonClickSelector: {
    selector:
      'button[data-remote]:not([form]), button[data-confirm]:not([form])',
    exclude: 'form button'
  },

  // Select elements bound by rails-ujs
  inputChangeSelector: {
    selector: 'select[data-remote], input[data-remote], textarea[data-remote]'
  },

  // Form elements bound by rails-ujs
  formSubmitSelector: {
    selector: 'form'
  },

  // Form input elements bound by rails-ujs
  formInputClickSelector: {
    selector:
      'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])'
  },

  // Form input elements disabled during form submission
  formDisableSelector: {
    selector:
      'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled'
  },

  // Form input elements re-enabled after form submission
  formEnableSelector: {
    selector:
      'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled'
  },

  // Form file input elements
  fileInputSelector: { selector: 'input[name][type=file]:not([disabled])' },

  // Link onClick disable selector with possible reenable after remote submission
  linkDisableSelector: { selector: 'a[data-disable-with], a[data-disable]' },

  // Button onClick disable selector with possible reenable after remote submission
  buttonDisableSelector: {
    selector:
      'button[data-remote][data-disable-with], button[data-remote][data-disable]'
  }
}
