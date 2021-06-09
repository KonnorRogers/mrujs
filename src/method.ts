import { SELECTORS } from './utils/dom'
import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'

export const ALLOWABLE_METHODS = [
  'get',
  'head',
  'post',
  'put',
  'delete',
  'patch'
]

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
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    const element = event.target as HTMLAnchorElement
    let method = element.getAttribute('data-method') ?? 'get'

    if (!ALLOWABLE_METHODS.includes(method.toLowerCase())) {
      method = 'get'
    }

    const href = element.getAttribute('href')

    if (href == null) return

    const fetchRequest = new FetchRequest(href, { method })
    const { request } = fetchRequest

    fetch(request).then((response) => {
      const fetchResponse = new FetchResponse(response)
      window.mrujs?.navigationAdapter.navigate(fetchResponse, element, fetchRequest)
    }).catch((error) => console.error(error))
  }

  get allLinks (): HTMLAnchorElement[] {
    return Array.from(document.querySelectorAll(SELECTORS.linkClickSelector.selector))
  }
}
