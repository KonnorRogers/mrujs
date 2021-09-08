export function JsErb (): Record<string, unknown> {
  const name = "JsErb"
  return {
    name,
    connect,
    disconnect
  }
}

function connect (): void {
  document.addEventListener("ajax:complete", injectScriptIntoHead)
}

function disconnect (): void {
  document.removeEventListener("ajax:complete", injectScriptIntoHead)
}

function cspNonce (): string | undefined {
  return ((document.querySelector("meta[name=csp-nonce]") as HTMLMetaElement)?.content)
}

async function injectScriptIntoHead (event: CustomEvent): Promise<void> {
  if (!isJavascriptResponse(event.detail?.fetchResponse?.contentType)) return

  // https://github.com/rails/rails/blob/fa1a4b657c7167a8671a359a55de3f9b37f4330b/actionview/app/assets/javascripts/rails-ujs/utils/ajax.coffee#L13
  const script = document.createElement('script')
  script.setAttribute('nonce', cspNonce())
  script.text = await event.detail?.fetchResponse?.text()
  document.head.appendChild(script).parentNode.removeChild(script)

  const { element, fetchRequest, fetchResponse } = event.detail

  // @ts-expect-error
  window.mrujs.navigationAdapter.navigate(element, fetchRequest, fetchResponse)
}

function isJavascriptResponse (contentType: string | undefined): boolean {
  if (contentType == null) return false

  const mimeType = 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01'
  const responseWithoutEncoding = contentType.split(/;\s+/)[0]
  const responseRegex = new RegExp(responseWithoutEncoding)
  return Boolean(mimeType.match(responseRegex))
}

