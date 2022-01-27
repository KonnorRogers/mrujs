// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/csrf.coffee
import { getCookieValue, getMetaContent } from './utils/misc'
import { MrujsPluginInterface } from './types'
import { $ } from './utils/dom'

export function Csrf (): MrujsPluginInterface {
  return {
    name: 'Csrf',
    connect,
    disconnect,
    observerCallback
  }
}

function connect (): void {
  refreshCSRFTokens()
}

function disconnect (): void {}

function observerCallback (nodeList: Node[]): void {
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i]
    if (isCsrfToken(node)) {
      refreshCSRFTokens()
    }
  }
}

// Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
export function refreshCSRFTokens (): void {
  const token = csrfToken()
  const param = csrfParam()

  if (token != null && param != null) {
    $(`form input[name="${param}"]`).forEach(input => {
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
export function csrfToken (): string | undefined {
  return getCookieValue(csrfParam()) ?? getMetaContent('csrf-token')
}

// URL param that must contain the CSRF token
export function csrfParam (): string | undefined {
  return getMetaContent('csrf-param')
}

export function CSRFProtection (request: Request): void {
  const token = csrfToken()
  const str = 'X-CSRF-TOKEN'
  if (token != null && request.headers.get(str) == null) request.headers.set('X-CSRF-TOKEN', token)
}
