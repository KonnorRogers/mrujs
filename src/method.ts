import { AJAX_EVENTS, dispatch, stopEverything } from './utils/events'
import { MrujsPluginInterface } from './types'
import { match } from './utils/dom'
import { LinkSubmission } from './linkSubmission'

/**
 * Handles `data-method="method"` submissions.
 */
export function Method (): MrujsPluginInterface {
  return {
    name: 'Method',
    connect,
    disconnect,
    observerCallback
  }
}

function connect (): void {
  allLinks().forEach((link: HTMLAnchorElement): void => {
    link.addEventListener('click', handle)
  })
}

function disconnect (): void {
  allLinks().forEach((link: HTMLAnchorElement) => {
    link.removeEventListener('click', handle)
  })
}

function observerCallback (nodeList: Node[]): void {
  const { linkClickSelector } = window.mrujs.querySelectors
  nodeList.forEach((node) => {
    if (match(node, linkClickSelector)) {
      node.addEventListener('click', handle)
    }

    if (node instanceof Element) {
      node.querySelectorAll(linkClickSelector.selector).forEach((el) => {
        el.addEventListener('click', handle)
      })
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
function handle (event: Event): void {
  stopEverything(event)

  const link = event.currentTarget as HTMLAnchorElement

  // no href? Do not pass go.
  if (link.href == null) return

  const submitter = event.target

  const linkSubmission = LinkSubmission(link)

  const { fetchRequest, request } = linkSubmission

  /**
    * Send it through the event chain. use ajax:beforeSend because submit auto
    * populates fields that we dont want.
    */
  dispatch.call(link, AJAX_EVENTS.ajaxBeforeSend, {
    detail: { element: link, fetchRequest, request, submitter }
  })
}

function allLinks (): HTMLAnchorElement[] {
  return Array.from(document.querySelectorAll(window.mrujs.querySelectors.linkClickSelector.selector))
}
