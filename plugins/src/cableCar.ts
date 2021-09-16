interface CableReady {
  perform: (json: JSON) => void
}

interface CableCarConfig {
  mimeType?: string
}

export class CableCar {
  cableReady: CableReady
  mimeType: string
  boundPerform: EventListener

  constructor (cableReady: CableReady, { mimeType }: CableCarConfig = {}) {
    this.cableReady = cableReady
    this.mimeType = (mimeType ?? 'application/vnd.cable-ready.json')
    this.boundPerform = this.perform.bind(this) as EventListener
  }

  get name (): string {
    return 'CableCar'
  }

  initialize (): void {
    const anyHeader = window.mrujs.config.mimeTypes.any
    window.mrujs.registerMimeTypes([
      { shortcut: 'any', header: `${this.mimeType}, ${anyHeader}` }
    ])
  }

  connect (): void {
    document.addEventListener('ajax:complete', this.boundPerform)
  }

  disconnect (): void {
    document.removeEventListener('ajax:complete', this.boundPerform)
  }

  perform (event: CustomEvent): void {
    const fetchResponse = event.detail.fetchResponse

    if (fetchResponse?.contentType == null) return
    if (!this.isCableReadyResponse(fetchResponse.contentType)) return

    fetchResponse.json().then((response: JSON) => {
      this.cableReady.perform(response)
    }).catch((err: Error) => {
      console.error(err)
    })
  }

  isCableReadyResponse (contentType: string): boolean {
    const responseWithoutEncoding = contentType.split(/;\s+/)[0]
    const responseRegex = new RegExp(responseWithoutEncoding)
    return Boolean(this.mimeType.match(responseRegex))
  }
}
