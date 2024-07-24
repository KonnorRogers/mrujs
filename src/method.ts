import { AJAX_EVENTS, dispatch } from './utils/events'
import { EventQueryInterface, MrujsPluginInterface } from '../types'
import { addListeners, removeListeners, attachObserverCallback } from './utils/dom'
import { MethodSubmission } from './methodSubmission'
import { isSignificantClick } from './utils/misc'

/**
 * Handles `data-method="method"` submissions.
 */
export function Method (): MrujsPluginInterface {
  const callbacks = [handleMethod] as EventListener[]
  let queries: EventQueryInterface[] = []

  function initialize (): void {
    queries = getQueries()
  }

  function connect (): void {
    addListeners(queries, callbacks)
  }

  function disconnect (): void {
    removeListeners(queries, callbacks)
  }

  function observerCallback (nodeList: Node[]): void {
    attachObserverCallback(queries, nodeList, callbacks)
  }

  return {
    name: 'Method',
    initialize,
    connect,
    disconnect,
    observerCallback,
    queries,
    callbacks
  }
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
export function handleMethod (event: MouseEvent | Event): void {
  const element = event.currentTarget as HTMLElement

  // Make sure we dont fire on ctrl clicks.
  if (event instanceof MouseEvent && isSignificantClick(event)) { return }
  if (element.dataset.remote === 'false') return
  if (element.dataset.method == null && element.dataset.remote !== 'true') return

  // no href or url? Do not pass go.
  const href = element.getAttribute('href') ?? element.dataset.url

  if (href == null) return

  event.preventDefault()
  const submitter = event.target

  const linkSubmission = MethodSubmission(element)

  const { fetchRequest, request } = linkSubmission

  /**
    * Send it through the event chain. use ajax:beforeSend because submit auto
    * populates fields that we dont want.
    */
  dispatch.call(element, AJAX_EVENTS.ajaxBeforeSend, {
    detail: { element, fetchRequest, request, submitter }
  })
}

function getQueries (): EventQueryInterface[] {
  const { linkClickSelector, inputChangeSelector, buttonClickSelector } = window.mrujs

  return [
    {
      event: 'click',
      selectors: [
        linkClickSelector,
        buttonClickSelector
      ]
    },
    {
      event: 'change',
      selectors: [
        inputChangeSelector
      ]
    }
  ]
}
