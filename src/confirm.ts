import { dispatch, stopEverything } from './utils/events'
import { addListeners, removeListeners, attachObserverCallback } from './utils/dom'
import { EventQueryInterface, MrujsPluginInterface } from './types'

export function Confirm (): MrujsPluginInterface {
  return {
    name: 'Confirm',
    connect,
    disconnect,
    observerCallback,
    queries
  }
}

function connect (): void {
  addListeners(queries(), [handleConfirm] as EventListener[])
}

function disconnect (): void {
  removeListeners(queries(), [handleConfirm] as EventListener[])
}

function observerCallback (nodeList: Node[]): void {
  attachObserverCallback(queries(), nodeList, [handleConfirm] as EventListener[])
}

function handleConfirm (event: Event | CustomEvent): void {
  if (event.currentTarget == null) return

  const element = event.currentTarget as HTMLElement
  const message = element.dataset.confirm

  if (message == null) return

  let answer = false

  try {
    answer = window.mrujs.confirm(message)
  } catch (e) {
    console.warn('there was an error with mrujs.confirm')
  }

  if (answer) {
    dispatch.call(element, 'confirm:complete', { detail: { answer } })
    return
  }

  stopEverything(event)
}

function queries (): EventQueryInterface[] {
  const { querySelectors } = window.mrujs
  return [
    {
      event: 'click',
      selectors: [
        querySelectors.linkClickSelector.selector,
        querySelectors.buttonClickSelector.selector,
        querySelectors.formInputClickSelector.selector
      ]
    },
    {
      event: 'change',
      selectors: [
        querySelectors.inputChangeSelector.selector
      ]
    },
    {
      event: 'submit',
      selectors: [
        querySelectors.formSubmitSelector.selector
      ]
    }
  ]
}
