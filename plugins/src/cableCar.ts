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
    this.mimeType = mimeType ?? 'text/vnd.cable-ready.json'
    this.boundPerform = this.perform.bind(this) as EventListener
  }

  get name (): string {
    return 'CableCar'
  }

  initialize (): void {
    const anyHeader = window.mrujs.mimeTypes.any
    window.mrujs.registerMimeTypes([
      { shortcut: 'any', header: `${this.mimeType}, ${anyHeader}` },
      { shortcut: 'cablecar', header: this.mimeType }
    ])
  }

  connect (): void {
    document.addEventListener('ajax:beforeNavigation', this.boundPerform)
  }

  disconnect (): void {
    document.removeEventListener('ajax:beforeNavigation', this.boundPerform)
  }

  perform (event: CustomEvent): void {
    const fetchResponse = event.detail.fetchResponse

    if (fetchResponse?.contentType == null) return
    if (!this.isCableReadyResponse(fetchResponse.contentType)) return

    event.preventDefault()
    fetchResponse.json().then((response: JSON) => {
      this.cableReady.perform(response)
    }).catch((err: Error) => {
      console.error(err)
    })
  }

  isCableReadyResponse (contentType: string): boolean {
    return Boolean(contentType.includes(this.mimeType))
  }
}
