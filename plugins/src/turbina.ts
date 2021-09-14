interface ExtendedElement extends HTMLElement {
  observer?: MutationObserver
}

interface Turbo {
  renderStreamMessage: (turbo: string) => void
}

export class Turbina {
  observer: MutationObserver
  elements: ExtendedElement[]
  turbo: Turbo
  mimeType: string

  boundPerform: EventListener
  boundScanner: MutationCallback & EventListener

  constructor (turbo: Turbo) {
    this.boundScanner = this.scanner.bind(this)
    this.boundPerform = this.perform.bind(this) as EventListener

    this.observer = new MutationObserver(this.boundScanner)
    this.elements = []
    this.turbo = turbo
    this.mimeType = 'text/vnd.turbo-stream.html, */*'
  }

  connect (): void {
    this.scanner() // Attach to all currently existing nodes / elements.

    // Now lets scan the dom on any big updates.
    document.addEventListener('DOMContentLoaded', this.boundScanner)
    document.addEventListener('turbo:load', this.boundScanner)
    document.addEventListener('ajax:complete', this.boundPerform)

    this.observer.observe(document.documentElement, {
      attributeFilter: ['data-turbina'],
      childList: true,
      subtree: true
    })
  }

  disconnect (): void {
    this.elements.forEach((element: ExtendedElement) => {
      element.observer?.disconnect()
    })

    document.removeEventListener('DOMContentLoaded', this.boundScanner)
    document.removeEventListener('turbo:load', this.boundScanner)
    document.removeEventListener('ajax:complete', this.boundPerform)
  }

  scanner (): void {
    Array.from(document.querySelectorAll('[data-turbina]'))
      .filter(element => {
        return ((element as ExtendedElement).observer == null)
      })
      .forEach(element => {
        const el = element as ExtendedElement
        el.dataset.type = this.mimeType
        el.dataset.remote = 'true'
        el.observer = new MutationObserver(this.integrity)
        el.observer.observe(element, {
          attributeFilter: ['data-type', 'data-remote']
        })
        this.elements.push(el)
      })
  }

  integrity (mutations: MutationRecord[]): void {
    mutations.forEach(mutation => {
      const element = mutation.target as HTMLElement
      if (!element.hasAttribute('data-type')) element.dataset.type = this.mimeType
      if (!element.hasAttribute('data-remote')) element.dataset.remote = 'true'
    })
  }

  perform (event: CustomEvent): void {
    const fetchResponse = event.detail.fetchResponse

    if (fetchResponse == null) return
    if (!this.isTurboResponse(fetchResponse.contentType)) return

    fetchResponse.html().then((responseHtml: string) => {
      this.turbo.renderStreamMessage(responseHtml)
    }).catch((err: Error) => {
      console.error(err)
    })
  }

  isTurboResponse (contentType: string): boolean {
    const responseWithoutEncoding = contentType.split(/;\s+/)[0]
    const responseRegex = new RegExp(responseWithoutEncoding)
    return Boolean(this.mimeType.match(responseRegex))
  }
}
