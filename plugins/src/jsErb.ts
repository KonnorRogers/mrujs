export function JsErb (): Record<string, unknown> {
  const name = 'JsErb'
  return {
    name,
    connect,
    disconnect
  }
}

function connect (): void {
  document.addEventListener('ajax:complete', injectScriptIntoHead as EventListener)
}

function disconnect (): void {
  document.removeEventListener('ajax:complete', injectScriptIntoHead as EventListener)
}

function cspNonce (): string | undefined {
  return ((document.querySelector('meta[name=csp-nonce]') as HTMLMetaElement)?.content)
}

function injectScriptIntoHead (event: CustomEvent): void {
  if (!isJavascriptResponse(event.detail?.fetchResponse?.contentType)) return

  // https://github.com/rails/rails/blob/fa1a4b657c7167a8671a359a55de3f9b37f4330b/actionview/app/assets/javascripts/rails-ujs/utils/ajax.coffee#L13
  const script = document.createElement('script')

  const csp = cspNonce()

  if (csp != null) script.setAttribute('nonce', csp)

  // @ts-expect-error
  window.mrujs.enableElement(event)

  event.detail?.fetchResponse?.text().then((html: string) => {
    script.text = html
    document.head.appendChild(script)?.parentNode?.removeChild(script)
    const { element, fetchRequest, fetchResponse } = event.detail
    // @ts-expect-error
    window.mrujs.navigationAdapter.navigate(element, fetchRequest, fetchResponse)
    // ^ not sure this is actually needed, but we'll leave it just in case.
  }).catch((err: Error) => console.error(err))
}

function isJavascriptResponse (contentType: string | undefined): boolean {
  if (contentType == null) return false

  return Boolean(contentType.match(/\b(?:java|ecma)script\b/))
}
