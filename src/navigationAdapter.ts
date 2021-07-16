import { expandUrl, Locateable } from './utils/url'
import morphdom from 'morphdom'

import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'

export interface Adapter {
  visit: (location: Locateable, { action }: { action: VisitAction }) => void
  clearCache: () => void

  // Turbolinks
  supported?: boolean
  Snapshot: {
    wrap: (str: string) => string
  }
  controller: {
    cache: {
      put: (location: Locateable, snapshot: string) => void
    }
  }

  // Turbo
  PageSnapshot?: {
    fromHTMLString: (str: string) => string
  }
  navigator: {
    view: {
      snapshotCache: {
        put: (location: Locateable, snapshot: string) => void
      }
    }
  }
}

const ALLOWABLE_ACTIONS = [
  'advance',
  'replace',
  'restore'
]

export type VisitAction = 'advance' | 'replace' | 'restore'

export class NavigationAdapter {
  private readonly boundNavigateViaEvent: (event: CustomEvent) => void

  constructor () {
    this.boundNavigateViaEvent = this.navigateViaEvent.bind(this)
  }

  get name (): string {
    return NavigationAdapter.name
  }

  connect (): void {
    document.addEventListener('ajax:complete', this.boundNavigateViaEvent as EventListener)
  }

  disconnect (): void {
    document.removeEventListener('ajax:complete', this.boundNavigateViaEvent as EventListener)
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

    if (this.adapter == null) return

    this.adapter.clearCache()

    // Special navigation handling for Turbo[links].
    if (response.isHtml) {
      this.preventDoubleVisit(response, location, action)
      return
    }

    this.adapter.visit(location, { action })
  }

  get adapter (): Adapter | undefined {
    if (this.useTurbolinks) {
      return window.Turbolinks
    }

    if (this.useTurbo) {
      return window.Turbo
    }

    return undefined
  }

  get useTurbolinks (): boolean {
    if (window.Turbolinks == null) return false
    if (window.Turbolinks.supported !== true) return false

    return true
  }

  get useTurbo (): boolean {
    if (window.Turbo == null) return false

    return true
  }

  preventDoubleVisit (response: FetchResponse, location: Locateable, action: VisitAction): void {
    if (this.adapter == null) return

    // This is a fun wrapper to avoid double visits with Turbolinks
    response.responseHtml.then((html) => {
      const snapshot = this.generateSnapshotFromHtml(html, this.adapter as Adapter)
      this.putSnapshotInCache(location, snapshot, this.adapter as Adapter)
      action = 'restore'
      this.adapter?.visit(location, { action })
    }).catch((error) => console.error(error))
  }

  generateSnapshotFromHtml (html: string, adapter: Adapter): string {
    if (this.useTurbolinks) {
      return adapter.Snapshot.wrap(html)
    }

    if (this.useTurbo && (adapter.PageSnapshot != null)) {
      return adapter.PageSnapshot.fromHTMLString(html)
    }

    return ''
  }

  putSnapshotInCache (location: Locateable, snapshot: string, adapter: Adapter): void {
    if (snapshot === '') return

    if (this.useTurbolinks) {
      adapter.controller.cache.put(location, snapshot)
      return
    }

    if (this.useTurbo) {
      adapter.navigator.view.snapshotCache.put(location, snapshot)
    }
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
      })
      .catch((error: Error) => {
        console.error(error)
      })
  }

  determineAction (element: HTMLElement): VisitAction {
    let action = element.dataset.turbolinksAction ?? element.dataset.turboAction

    if (action == null || !ALLOWABLE_ACTIONS.includes(action)) {
      action = 'advance'
    }

    return action as VisitAction
  }
}
