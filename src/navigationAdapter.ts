import { expandUrl, Locateable } from './utils/url'
import morphdom from 'morphdom'

import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'

const ALLOWABLE_ACTIONS = [
  'advance',
  'replace',
  'restore'
]

type VisitAction = 'advance' | 'replace' | 'restore'

export class NavigationAdapter {
  private readonly __navigateViaEvent__: Function

  constructor () {
    this.__navigateViaEvent__ = this.navigateViaEvent.bind(this)
  }

  connect (): void {
    document.addEventListener('ajax:complete', this.__navigateViaEvent__ as EventListener)
  }

  disconnect (): void {
    document.removeEventListener('ajax:complete', this.__navigateViaEvent__ as EventListener)
  }

  /**
   * Currently, this only fires on successful form submissions.
   */
  navigateViaEvent (event: CustomEvent): void {
    const { element, fetchResponse, fetchRequest } = event.detail
    if (fetchResponse == null) return

    // Only render / navigate responses on html responses.
    if (fetchResponse.isHtml === false) return

    if (element instanceof HTMLFormElement && fetchResponse.succeeded === true && fetchResponse.redirected === false) {
      console.error('Successful form submissions must redirect')
      return
    }

    // Dont navigate on <a data-method="get"> for links.
    if (element instanceof HTMLAnchorElement && fetchRequest.isGetRequest === true) return

    this.navigate(fetchResponse, element, fetchRequest)
  }

  /**
   * This is a manual navigation triggered by something like `method: :delete`
   */
  navigate (response: FetchResponse, element: HTMLElement, request: FetchRequest, action?: VisitAction): void {
    // If we get redirected, use Turbolinks
    // This needs to be reworked to not trigger 2 HTML responses or find a
    // way to not refetch a page.
    action = action ?? this.determineAction(element)

    let location = expandUrl(window.location.href)

    if (request?.isGetRequest) location = request.url
    if (response.redirected) location = response.location

    if (response.failed) {
      // Use morphdom to dom diff the response if the response is HTML.
      this.morphResponse(response)
      return
    }

    if (!this.useTurbolinks) return

    window.Turbolinks.clearCache()

    if (response.isHtml) {
      this.navigateToResponse(response, location, action)
      return
    }

    window.Turbolinks.visit(location, { action })
  }

  get useTurbolinks (): boolean {
    if (window.Turbolinks == null) return false
    if (window.Turbolinks.supported !== true) return false

    return true
  }

  navigateToResponse (response: FetchResponse, location: Locateable, action: VisitAction): void {
    response.responseHtml.then((html) => {
      const snapshot = window.Turbolinks.Snapshot.wrap(html)
      window.Turbolinks.controller.cache.put(location, snapshot)
      action = 'restore'
      window.Turbolinks.visit(location, { action })
    }).catch((error) => console.error(error))
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

  determineAction (element: HTMLElement): VisitAction {
    let action = element.dataset.turbolinksAction

    if (action == null || !ALLOWABLE_ACTIONS.includes(action)) {
      action = 'advance'
    }

    return action as VisitAction
  }
}
