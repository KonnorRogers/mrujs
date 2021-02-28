// This file is copied from:
// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/dom.coffee

const m =
  Element.prototype.matches ||
  Element.prototype.matchesSelector ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.oMatchesSelector ||
  Element.prototype.webkitMatchesSelector;

/**
 * Checks if the given native dom element matches the selector
 * @param {HTMLElement} element - native dom element
 * @param {object} obj
 * @param {string} obj.selector - Selectors to include (required)
 * @param {string} obj.exclude - Selectors to exclude
 * @return {boolean} Returns true if found, false otherwise
 * @example
 *   match(document.querySelector("form"), { selector: "form", exclude: "form[data-remote='true']"})
 */
export function match(element, { selector, exclude }) {
  if (exclude) {
    return m.call(element, selector) && !m.call(element, selector);
  }

  return m.call(element, selector);
}
export const SELECTORS = {
  // Link elements bound by rails-ujs
  linkClickSelector: {
    selector:
      'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
  },

  // Button elements bound by rails-ujs
  buttonClickSelector: {
    selector:
      'button[data-remote]:not([form]), button[data-confirm]:not([form])',
    exclude: 'form button',
  },

  // Select elements bound by rails-ujs
  inputChangeSelector: {
    selector: 'select[data-remote], input[data-remote], textarea[data-remote]',
  },

  // Form elements bound by rails-ujs
  formSubmitSelector: {
    selector: 'form',
  },

  // Form input elements bound by rails-ujs
  formInputClickSelector: {
    selector:
      'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
  },

  // Form input elements disabled during form submission
  formDisableSelector: {
    selector:
      'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
  },

  // Form input elements re-enabled after form submission
  formEnableSelector: {
    selector:
      'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
  },

  // Form file input elements
  fileInputSelector: { selector: 'input[name][type=file]:not([disabled])' },

  // Link onClick disable selector with possible reenable after remote submission
  linkDisableSelector: { selector: 'a[data-disable-with], a[data-disable]' },

  // Button onClick disable selector with possible reenable after remote submission
  buttonDisableSelector: {
    selector:
      'button[data-remote][data-disable-with], button[data-remote][data-disable]',
  },
};
