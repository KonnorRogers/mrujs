import { Ajax, ExtendedRequestInit } from './ajax'
import { Csrf } from './csrf'
import { enableSubmitter, disableSubmitter } from './submitToggle'
import { SELECTORS } from './utils/dom'

export class Mrujs {
  config: Record<string, unknown>
  csrf: Csrf
  ajax: Ajax

  constructor (config = {}) {
    this.config = config
    this.csrf = new Csrf()
    this.ajax = new Ajax()
  }

  // connect
  start (): Mrujs {
    this.csrf.connect()
    this.ajax.connect()

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    window.addEventListener('pageshow', () => {
      document
        .querySelectorAll(SELECTORS.formEnableSelector.selector)
        .forEach(element => {
          const el = element as HTMLInputElement
          // Reenable any elements previously disabled
          if (el.dataset['mrujs-disabled']) {
            el.disabled = false
          }
        })

      document
        .querySelectorAll(SELECTORS.linkDisableSelector.selector)
        .forEach(element => {
          const el = element as HTMLInputElement
          if (el.dataset['mrujs-disabled']) {
            el.disabled = false
          }
        })
    })

    document.addEventListener('submit', disableSubmitter as EventListener)
    document.addEventListener('ajax:complete', enableSubmitter as EventListener)

    return this
  }

  // disconnect
  stop () {
    this.ajax.disconnect()
    this.csrf.disconnect()
  }

  /**
   * Takes in an object and will convert it to a Request. {url} is required.
   * If request is null, it comes from a form. If a request object is given,
   * it is required to have a {url:} defined.
   * @see Ajax#fetch
   */
  fetch (request: ExtendedRequestInit) {
    this.ajax.fetch(request)
  }

  get csrfToken () {
    return this.csrf.token
  }
}
