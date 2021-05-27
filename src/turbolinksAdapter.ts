export class TurbolinksAdapter {
  __turbolinksVisit__!: Function

  connect () {
    this.__turbolinksVisit__ = this.turbolinksVisit.bind(this)
    document.addEventListener("ajax:complete", this.__turbolinksVisit__ as EventListener)
  }

  disconnect () {
    document.removeEventListener("ajax:complete", this.__turbolinksVisit__ as EventListener)
  }

  turbolinksVisit(event: CustomEvent) {
    if (!window.Turbolinks.supported) return

    const response = event.detail.response

    if (response == null) return

    let action = "advance"

    if (!response.redirected) {
      action = "replace"
    }

    window.Turbolinks.clearCache()
    window.Turbolinks.visit(location, action)
  }
}

