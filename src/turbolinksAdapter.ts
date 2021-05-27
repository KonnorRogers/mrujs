export class TurbolinksAdapter {
  __turbolinksVisit__!: Function

  connect (): void {
    this.__turbolinksVisit__ = this.turbolinksVisit.bind(this)
    document.addEventListener('ajax:complete', this.__turbolinksVisit__ as EventListener)
  }

  disconnect (): void {
    document.removeEventListener('ajax:complete', this.__turbolinksVisit__ as EventListener)
  }

  turbolinksVisit (event: CustomEvent): void {
    if (window.Turbolinks.supported !== true) return

    const response = event.detail.response

    if (response == null) return

    const action = 'advance'

    // TODO: When should we actually use replace other than when specified??
    // if (response.redirected != true) {
    //   action = 'replace'
    // }

    window.Turbolinks.clearCache()
    window.Turbolinks.visit(location, { action })
  }
}
