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
      subtree: true
    }
  }

  get name (): string {
    return AddedNodesObserver.name
  }

  connect (): void {
    this.observer.observe(document, this.observerOptions)
  }

  disconnect (): void {
    this.observer.disconnect()
  }
}
