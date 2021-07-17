import { expandUrl } from './utils/url'
import morphdom from 'morphdom'

import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'

import { SnapshotCacheInterface, Locateable } from './types'

export interface Adapter {
  visit: (location: Locateable, { action }: { action: VisitAction }) => void
  clearCache: () => void

  // Turbolinks
  supported?: boolean
  Snapshot: {
    wrap: (str: string) => string
  }
  controller: {
    cache: SnapshotCacheInterface
  }

  // Turbo
  PageSnapshot?: {
    fromHTMLString: (str: string) => string
  }
  navigator: {
    view: {
      snapshotCache: SnapshotCacheInterface
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
  private readonly boundNavigateViaEvent: Function

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

  prefetch ({ html, url }: {html: string, url: Locateable}): void {
    const expandedUrl = expandUrl(url)
    const snapshot = this.generateSnapshotFromHtml(html)
    this.putSnapshotInCache(expandedUrl, snapshot)
  }

  get snapshotCache (): SnapshotCacheInterface | undefined {
    if (this.useTurbolinks) return this.adapter?.controller.cache
    if (this.useTurbo) return this.adapter?.navigator.view.snapshotCache
  }

  /**
   * Currently, this only fires on successful form submissions.
   */
  private navigateViaEvent (event: CustomEvent): void {
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
  private navigate (response: FetchResponse, element: HTMLElement, request: FetchRequest, action?: VisitAction): void {
    if (!response.isHtml) return
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
    this.preventDoubleVisit(response, location, action)
  }

  private putSnapshotInCache (location: Locateable, snapshot: string): void {
    if (snapshot === '') return

    this.snapshotCache?.put(expandUrl(location), snapshot)
  }

  private generateSnapshotFromHtml (html: string): string {
    if (this.useTurbolinks) {
      return this.adapter?.Snapshot.wrap(html) ?? ''
    }

    if (this.useTurbo && this.canSnapshot) {
      return this.adapter?.PageSnapshot?.fromHTMLString(html) ?? ''
    }

    return ''
  }

  private get canSnapshot (): boolean {
    if (this.useTurbolinks) return true
    if (this.useTurbo) {
      // PageSnapshot is required in Turbo to manually generate Snapshots.
      if (this.adapter?.PageSnapshot == null) {
        console.warn(
          `The version of Turbo you are currently using does not support
           snapshot generation. Please consider upgrading your version of Turbo.`
        )

        return false
      }

      return true
    }

    return false
  }

  private preventDoubleVisit (response: FetchResponse, location: Locateable, action: VisitAction): void {
    if (this.adapter == null) return

    // This is a fun wrapper to avoid double visits with Turbolinks
    response.responseHtml.then((html) => {
      this.prefetch({ html, url: location })
      action = 'restore'
      this.adapter?.visit(location, { action })
    }).catch((error) => console.error(error))
  }

  private morphResponse (response: FetchResponse): void {
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

  private determineAction (element: HTMLElement): VisitAction {
    let action = element.dataset.turbolinksAction ?? element.dataset.turboAction

    if (action == null || !ALLOWABLE_ACTIONS.includes(action)) {
      action = 'advance'
    }

    return action as VisitAction
  }
}
