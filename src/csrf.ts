// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/csrf.coffee
import { getCookieValue, getMetaContent } from './utils/misc'
import { MrujsPluginInterface } from './types'

export function Csrf (): MrujsPluginInterface {
  return {
    name: 'Csrf',
    connect,
    disconnect,
    observerCallback
  }
}

function connect (): void {
  refresh()
}

function disconnect (): void {}

function observerCallback (nodeList: Node[]): void {
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i]
    if (isCsrfToken(node)) {
      refresh()
    }
  }
}

// Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
function refresh (): void {
  const token = getToken()
  const param = getParam()

  if (token != null && param != null) {
    document
      .querySelectorAll(`form input[name="${param}"]`)
      .forEach(input => {
        const inputEl = input as HTMLInputElement
        inputEl.value = token
      })
  }
}

function isCsrfToken (node: Node): boolean {
  if (node instanceof HTMLMetaElement) {
    return node.matches('meta[name="csrf-token]"')
  }

  return false
}

// Up-to-date Cross-Site Request Forgery token
export function getToken (): string | undefined {
  return getCookieValue(getParam()) ?? getMetaContent('csrf-token')
}

// URL param that must contain the CSRF token
export function getParam (): string | undefined {
  return getMetaContent('csrf-param')
}
