import { MrujsPluginInterface } from '../../src/types'

export function MrujsTurbo (): MrujsPluginInterface {
  return {
    name: 'MrujsTurbo',
    initialize,
    connect,
    disconnect
  }
}

const mimeType = 'text/vnd.turbo-stream.html'

function initialize (): void {
  const anyHeader = window.mrujs.mimeTypes.any
  window.mrujs.registerMimeTypes([
    { shortcut: 'any', header: `${mimeType}, ${anyHeader}` },
    { shortcut: 'turbo', header: mimeType }
  ])
}

function connect (): void {
  document.addEventListener('ajax:beforeNavigation', handleTurboStream)
}

function disconnect (): void {
  document.removeEventListener('ajax:beforeNavigation', handleTurboStream)
}

function handleTurboStream (event: CustomEvent): void {
  const fetchResponse = event.detail.fetchResponse

  if (fetchResponse == null) return
  if (!isTurboResponse(fetchResponse.contentType)) return

  event.preventDefault() // => stop the navigationAdapter from trying to handle it.

  fetchResponse.html().then((responseHtml: string) => {
    // @ts-expect-error
    window.Turbo.renderStreamMessage(responseHtml)
  }).catch((err: Error) => {
    console.error(err)
  })
}

function isTurboResponse (contentType: string): boolean {
  return Boolean(contentType.includes(mimeType))
}
