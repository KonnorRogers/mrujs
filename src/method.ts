import { AJAX_EVENTS, dispatch, stopEverything } from './utils/events'
import { match } from './utils/dom'
import { LinkSubmission } from './linkSubmission'

/**
 * Handles `data-method="method" submissions.`
 */
export class Method {
  get name (): string {
    return Method.name
  }

  connect (): void {
    this.allLinks.forEach((link: HTMLAnchorElement): void => {
      link.addEventListener('click', this.handle)
    })
  }

  disconnect (): void {
    this.allLinks.forEach((link: HTMLAnchorElement) => {
      link.removeEventListener('click', this.handle)
    })
  }

  observerCallback (nodeList: Node[]): void {
    nodeList.forEach((node) => {
      if (match(node, window.mrujs.querySelectors.linkClickSelector)) {
        node.addEventListener('click', this.handle)
      }

      if (node instanceof Element) {
        node.querySelectorAll(window.mrujs.querySelectors.linkClickSelector.selector).forEach((el) => el.addEventListener('click', this.handle))
      }
    })
  }

  /**
   * Handles "data-method" on <a> tags such as:
   * @example
   *   // Not implemented!
   *   <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
   *
   *   // Implemented!
   *   <a href="/users/5" data-method="delete" rel="nofollow">Delete</a>
   */
  handle (event: Event): void {
    stopEverything(event)

    const link = event.currentTarget as HTMLAnchorElement
    const submitter = event.target

    const linkSubmission = new LinkSubmission(link)

    const { fetchRequest, request } = linkSubmission

    /**
     * Send it through the event chain. use ajax:beforeSend because submit auto
     * populates fields that we dont want.
     */
    dispatch.call(link, AJAX_EVENTS.ajaxBeforeSend, {
      detail: { element: link, fetchRequest, request, submitter }
    })
  }

  get allLinks (): HTMLAnchorElement[] {
    return Array.from(document.querySelectorAll(window.mrujs.querySelectors.linkClickSelector.selector))
  }
}
