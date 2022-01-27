import { dispatch } from './utils/events'
import morphdom from 'morphdom'

import { expandUrl, urlsAreEqual } from './utils/url'
import {
  Adapter, MrujsPluginInterface, SnapshotCacheInterface,
  Locateable, FetchRequestInterface, FetchResponseInterface,
  VisitAction
} from './types'

const ALLOWABLE_ACTIONS = [
  'advance',
  'replace',
  'restore'
]

export interface NavigationAdapterInterface extends MrujsPluginInterface {
  cacheContains: (url: Locateable) => boolean
  prefetch: ({ html, url }: {html: string, url: Locateable}) => void
  navigate: (element: HTMLElement, request: FetchRequestInterface, response: FetchResponseInterface, action?: VisitAction) => void
}

export function NavigationAdapter (): NavigationAdapterInterface {
  const obj = {
    name: 'NavigationAdapter',
    connect,
    disconnect,
    cacheContains,
    prefetch,
    navigate
  }

  Object.defineProperties(obj, {
    adapter: { get: function (): Adapter | undefined { return findAdapter() } },
    snapshotCache: { get: function (): SnapshotCacheInterface | undefined { return findSnapshotCache(findAdapter()) } }
  })

  return obj
}

function connect (): void {
  document.addEventListener('ajax:complete', beforeNavigation as EventListener)
  document.addEventListener('ajax:beforeNavigation', navigateViaEvent as EventListener)
}

function disconnect (): void {
  document.removeEventListener('ajax:complete', beforeNavigation as EventListener)
  document.removeEventListener('ajax:beforeNavigation', navigateViaEvent as EventListener)
}

function beforeNavigation (event: CustomEvent): void {
  if (event.defaultPrevented) return

  dispatch.call(event.detail.element, 'ajax:beforeNavigation', { detail: { ...event.detail } })
}

function findAdapter (): Adapter | undefined {
  if (useTurbolinks()) return window.Turbolinks
  if (useTurbo()) return window.Turbo
  return undefined
}

function useTurbolinks (): boolean {
  if (window.Turbolinks == null) return false
  if (window.Turbolinks.supported !== true) return false

  return true
}

function useTurbo (): boolean {
  if (window.Turbo == null) return false

  return true
}

function prefetch ({ html, url }: {html: string, url: Locateable}): void {
  const expandedUrl = expandUrl(url)
  const snapshot = generateSnapshotFromHtml(html)
  putSnapshotInCache(expandedUrl, snapshot)
}

function findSnapshotCache (adapter: Adapter | undefined): SnapshotCacheInterface | undefined {
  if (adapter == null) return undefined
  if (useTurbolinks()) return adapter.controller.cache
  if (useTurbo()) return adapter.navigator.view.snapshotCache
  return undefined
}

function cacheContains (url: Locateable): boolean {
  const expandedUrl = expandUrl(url)
  const snapshotCache = findSnapshotCache(findAdapter())
  return snapshotCache?.has(expandedUrl) ?? false
}

/**
  * Currently, this only fires on successful form submissions.
  */
function navigateViaEvent (event: CustomEvent): void {
  if (event.defaultPrevented) return

  const { element, fetchResponse, fetchRequest } = event.detail

  if (!shouldNavigate(element, fetchResponse)) return

  navigate(element, fetchRequest, fetchResponse)
}

function shouldNavigate (element: HTMLElement, fetchResponse: FetchResponseInterface): boolean {
  if (element.dataset.ujsNavigate === 'false') return false
  if (fetchResponse == null) return false

  // Only render / navigate responses on html responses.
  if (!fetchResponse.isHtml) return false

  if (element instanceof HTMLFormElement && fetchResponse.succeeded && !fetchResponse.redirected) {
    console.error('Successful form submissions must redirect')
    return false
  }

  return true
}

/**
  * This is a manual navigation triggered by something like `method: :delete`
  */
function navigate (element: HTMLElement, request: FetchRequestInterface, response: FetchResponseInterface, action?: VisitAction): void {
  // If we get redirected, use Turbolinks
  // This needs to be reworked to not trigger 2 HTML responses or find a
  // way to not refetch a page.
  action = action ?? determineAction(element)

  let location = expandUrl(window.location.href)

  if (request?.isGetRequest) location = request.url
  if (response.redirected) location = response.location

  const currentLocation = window.location.href
  const isSamePage = urlsAreEqual(location, currentLocation)

  if (response.failed || isSamePage) {
    // Use morphdom to dom diff the response if the response is HTML.
    morphResponse(response, !isSamePage)
    return
  }

  const adapter = findAdapter()

  if (adapter == null) {
    morphResponse(response, isSamePage)
    return
  }

  adapter.clearCache()

  // Special navigation handling for Turbo[links].
  preventDoubleVisit(response, location, action)
}

function putSnapshotInCache (location: Locateable, snapshot: string): void {
  if (snapshot === '') return

  const snapshotCache = findSnapshotCache(findAdapter())
  snapshotCache?.put(expandUrl(location), snapshot)
}

function generateSnapshotFromHtml (html: string): string {
  const adapter = findAdapter()

  if (adapter == null) return ''

  if (useTurbolinks()) {
    return adapter.Snapshot.wrap(html) ?? ''
  }

  if (useTurbo() && canSnapshot()) {
    return adapter.PageSnapshot?.fromHTMLString(html) ?? ''
  }

  return ''
}

function canSnapshot (): boolean {
  const adapter = findAdapter()

  if (adapter == null) return false

  if (useTurbolinks()) return true
  if (useTurbo()) {
    // PageSnapshot is required in Turbo to manually generate Snapshots.
    if (adapter.PageSnapshot == null) {
      console.warn(
        'The version of Turbo you are currently using does not support ' +
        'snapshot generation. Please consider upgrading your version of Turbo.'
      )

      return false
    }

    return true
  }

  return false
}

function preventDoubleVisit (response: FetchResponseInterface, location: Locateable, action: VisitAction): void {
  const adapter = findAdapter()

  if (adapter == null) return

  // This is a fun wrapper to avoid double visits with Turbolinks
  response.html().then((html) => {
    prefetch({ html, url: location })
    action = 'restore'
    adapter.visit(location, { action })
  }).catch((error) => console.error(error))
}

function morphResponse (response: FetchResponseInterface, pushState: boolean = false): void {
  // Dont pass go if its not HTML.
  if (!response.isHtml) return

  response.html()
    .then((html: string) => {
      morphHtml(html)

      if (pushState) {
        // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
        window.history.pushState({}, '', response.location)
      }
    })
    .catch((error: Error) => {
      console.error(error)
    })
}

function morphHtml (html: string): void {
  const template = document.createElement('template')
  template.innerHTML = String(html).trim()
  morphdom(document.body, template.content, { childrenOnly: true })
}

function determineAction (element: HTMLElement): VisitAction {
  let action = element.dataset.turbolinksAction ?? element.dataset.turboAction ?? 'advance'

  if (!ALLOWABLE_ACTIONS.includes(action)) {
    action = 'advance'
  }

  return action as VisitAction
}
