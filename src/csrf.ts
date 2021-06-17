// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/csrf.coffee
import { OBSERVER_OPTIONS } from './utils/observer'
import { Utils } from './utils'

export class Csrf {
  observer: MutationObserver
  observerOptions: MutationObserverInit

  constructor () {
    this.observer = new MutationObserver(this.observerCallback)
    this.observerOptions = OBSERVER_OPTIONS
  }

  connect (): void {
    // install the observer, then refresh.
    this.observer.observe(document, this.observerOptions)
    this.refresh()
  }

  disconnect (): void {
    this.observer.disconnect()
  }

  // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
  refresh (): void {
    if (this.token != null && this.param != null) {
      document
        .querySelectorAll(`form input[name="${this.param}"]`)
        .forEach(input => {
          const inputEl = input as HTMLInputElement
          inputEl.value = this.token as string
        })
    }
  }

  observerCallback (mutations: MutationRecord[]): void {
    for (const mutation of mutations) {
      // If a new csrf-token is added, lets update the token and refresh all form elements.
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (Csrf.isCsrfToken(node)) {
            this.refresh()
          }
        }
      } else if (mutation.type === 'attributes') {
        // For when the `meta[name='csrf-token'].content` changes
        const node = mutation.target
        if (Csrf.isCsrfToken(node)) {
          this.refresh()
        }
      }
    }
  }

  static isCsrfToken (node: Node): boolean {
    if (node instanceof HTMLMetaElement) {
      return node.matches('meta[name="csrf-token]"')
    }

    return false
  }

  // Up-to-date Cross-Site Request Forgery token
  get token (): string | null {
    return Utils.getCookieValue(Utils.getMetaContent('csrf-param')) ?? Utils.getMetaContent('csrf-token')
  }

  // URL param that must contain the CSRF token
  get param (): string | null {
    return Utils.getMetaContent('csrf-param')
  }
}
