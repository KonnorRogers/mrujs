import Ajax from './ajax.js';
import Csrf from './csrf.js';
import { enableSubmitter, disableSubmitter } from './submitToggle.js';
import { SELECTORS } from './utils/dom.js';

export default class Mrujs {
  constructor(config = {}) {
    this.config = config;
  }

  // connect
  start() {
    this.csrf.connect();
    this.ajax.connect();

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    window.addEventListener('pageshow', () => {
      document
        .querySelectorAll(SELECTORS.formEnableSelector.selector)
        .forEach(element => {
          const el = element;
          // Reenable any elements previously disabled
          if (el.dataset['mrujs-disabled']) {
            el.disabled = false;
          }
        });

      document
        .querySelectorAll(SELECTORS.linkDisableSelector.selector)
        .forEach(element => {
          const el = element;
          if (el.dataset['mrujs-disabled']) {
            el.disabled = false;
          }
        });
    });

    document.addEventListener('submit', disableSubmitter);
    document.addEventListener('ajax:complete', enableSubmitter);

    window._mrujs_loaded = true;
  }

  // disconnect
  stop() {
    this.ajax.disconnect();
    this.csrf.disconnect();
    window._mrujs_loaded = false;
  }

  /**
   * Takes in an object and will convert it to a Request. {url} is required.
   * If request is null, it comes from a form. If a request object is given,
   * it is required to have a {url:} defined.
   * @see Ajax#fetch
   */
  fetch(request = null) {
    this.ajax.fetch(request);
  }

  get ajax() {
    if (this._ajax) {
      return this._ajax;
    }

    this._ajax = new Ajax();
    return this._ajax;
  }

  get csrf() {
    if (this._csrf) {
      return this._csrf;
    }

    this._csrf = new Csrf();
    return this._csrf;
  }

  get csrfToken() {
    return this.csrf.token;
  }
}
