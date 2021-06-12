import { AJAX_EVENTS, dispatch, stopEverything } from './utils/events'
import { SELECTORS } from './utils/dom'
import { LinkSubmission } from './linkSubmission'

/**
 * Handles `data-method="method" submissions.`
 */
export class Method {
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

    const element = event.target as HTMLAnchorElement
    const submitter = element

    const linkSubmission = new LinkSubmission(element)

    const { fetchRequest, request } = linkSubmission

    /**
     * Send it through the event chain. use ajax:beforeSend because submit auto
     * populates fields that we dont want.
     */
    dispatch.call(element, AJAX_EVENTS.ajaxBeforeSend, {
      detail: { element, fetchRequest, request, submitter }
    })
  }

  get allLinks (): HTMLAnchorElement[] {
    return Array.from(document.querySelectorAll(SELECTORS.linkClickSelector.selector))
  }
}
