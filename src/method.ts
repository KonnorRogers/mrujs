import { stopEverything } from './utils/events'
import { SELECTORS } from './utils/dom'
import { LinkSubmission } from './linkSubmission'
import { FetchResponse } from './http/fetchResponse'

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

    const linkSubmission = new LinkSubmission(element)
    const { fetchRequest, request } = linkSubmission

    fetch(request).then((response) => {
      const fetchResponse = new FetchResponse(response)

      if (fetchRequest.isGetRequest) return

      window.mrujs?.navigationAdapter.navigate(fetchResponse, element, fetchRequest)
    }).catch((error) => console.error(error))
  }

  get allLinks (): HTMLAnchorElement[] {
    return Array.from(document.querySelectorAll(SELECTORS.linkClickSelector.selector))
  }
}
