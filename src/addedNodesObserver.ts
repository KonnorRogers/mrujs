import { BASE_MODIFIERS } from './utils/dom'

/**
 * Mutation observer for added nodes.
 */
export class AddedNodesObserver {
  readonly observer: MutationObserver
  readonly observerOptions: MutationObserverInit

  constructor (callback: MutationCallback) {
    this.observer = new MutationObserver(callback)
    this.observerOptions = {
      childList: true,
      subtree: true,
      attributeFilter: BASE_MODIFIERS
    }
  }

  connect (): void {
    this.observer.observe(document, this.observerOptions)
  }

  disconnect (): void {
    this.observer.disconnect()
  }
}
