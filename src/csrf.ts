// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/csrf.coffee
import { Misc } from './utils/misc'

export class Csrf {
  get name (): string {
    return Csrf.name
  }

  connect (): void {
    this.refresh()
  }

  disconnect (): void {}

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

  observerCalback (addedNodes: Node[]): void {
    addedNodes.forEach((node) => {
      if (Csrf.isCsrfToken(node)) {
        this.refresh()
      }
    })
  }

  static isCsrfToken (node: Node): boolean {
    if (node instanceof HTMLMetaElement) {
      return node.matches('meta[name="csrf-token]"')
    }

    return false
  }

  // Up-to-date Cross-Site Request Forgery token
  get token (): string | null {
    return Misc.getCookieValue(Misc.getMetaContent('csrf-param')) ?? Misc.getMetaContent('csrf-token')
  }

  // URL param that must contain the CSRF token
  get param (): string | null {
    return Misc.getMetaContent('csrf-param')
  }
}
