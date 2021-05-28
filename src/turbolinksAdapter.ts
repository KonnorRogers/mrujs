import morphdom from 'morphdom'

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
    if (window.Turbolinks == null) return
    if (window.Turbolinks.supported !== true) return

    const response = event.detail.response

    if (response == null) return
    if (response.redirected != true) return

    // const action = 'advance'

    // TODO: When should we actually use replace other than when specified??
    // leastbad says: this should be advance unless data-turbolinks-action="replace"
    //   action = 'replace'

    // i think that this should only happen if data-ujs-morph has been set, otherwise default to Turbolinks visit
    this.body(event).then(html => {
      const template = document.createElement('template')
      template.innerHTML = String(html).trim()
      morphdom(document.body, template.content, {childrenOnly: true})
      
      window.history.pushState({}, '', response.url)
      // this is obviously not the right thing to do, but we need to tell mrujs to re-init
      // this hack is causing InvalidAuthenticityToken exceptions in my app when I try to log out
      document.dispatchEvent(new CustomEvent('turbolinks:load'))
    })

    // wherever you handle remote forms, we can use the morphdom trick but not do the pushState if there's an error
    // so depending on the HTTP error that comes back... I guess 4xx errors, right?
    // seems like 5xx errors should be handled by the app directly

    // window.Turbolinks.clearCache()
    // window.Turbolinks.visit(location, { action })
  }

  async body (event: CustomEvent): Promise<string>  {
    return await event.detail.response.text()
  }
}
