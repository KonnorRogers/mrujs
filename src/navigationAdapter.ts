import morphdom from 'morphdom'

import { FetchResponse } from './http/fetchResponse'

const ALLOWABLE_ACTIONS = [
  'advance',
  'replace',
  'restore'
]

type VisitAction = 'advance' | 'replace' | 'restore'

interface VisitInit {
  location: URL | string
  action: VisitAction
}

export class NavigationAdapter {
  private __navigate__!: Function

  connect (): void {
    this.__navigate__ = this.navigate.bind(this)
    document.addEventListener('ajax:complete', this.__navigate__ as EventListener)
  }

  disconnect (): void {
    document.removeEventListener('ajax:complete', this.__navigate__ as EventListener)
  }

  navigate (event: CustomEvent): void {
    const response = event.detail.response

    if (response == null) return

    // Only render responses on html responses.
    if (response.isHtml === false) return

    if (response.succeeded === true && response.redirected === true) {
      console.error('Successful form submissions must redirect')
      return
    }

    // If we get redirected, use Turbolinks
    // This needs to be reworked to not trigger 2 HTML responses or find a
    // way to not refetch a page.
    // if (response.redirected) {
    //   const location = fetchResponse.location
    //   const action = this.determineAction(event)
    //   this.turbolinksVisit({ location, action })
    //   return
    // }

    // Use morphdom to dom diff the response if the response is HTML.
    this.morphResponse(response)
  }

  turbolinksVisit ({ location, action }: VisitInit): void {
    if (window.Turbolinks == null) return
    if (window.Turbolinks.supported !== true) return

    window.Turbolinks.clearCache()
    window.Turbolinks.visit(location, { action })
  }

  morphResponse (response: FetchResponse): void {
    // Dont pass go if its not HTML.
    if (!response.isHtml) return

    response.responseHtml
      .then((html: string) => {
        const template = document.createElement('template')
        template.innerHTML = String(html).trim()
        morphdom(document.body, template.content, { childrenOnly: true })

        // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
        // @ts-expect-error pushState accepts URL | string, but TS complains about URL.
        window.history.pushState({}, '', response.location)

        // This is only needed until we start using mutationObservers.
        window?.mrujs?.restart()
      })
      .catch((error: Error) => {
        console.error(error)
      })
  }

  determineAction (event: CustomEvent): VisitAction {
    let action = (event.target as HTMLElement).dataset.turbolinksAction

    if (action == null || !ALLOWABLE_ACTIONS.includes(action)) {
      action = 'advance'
    }

    return action as VisitAction
  }
}
