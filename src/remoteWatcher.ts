import { SelectorType, MrujsPluginInterface } from '../types'
import { $, matches } from './utils/dom'

export function RemoteWatcher (): MrujsPluginInterface {
  let query: SelectorType
  function initialize (): void {
    query = window.mrujs.remoteSelector
  }

  function connect (): void {
    $(query as string).forEach((el): void => {
      addTurboFalse(el)
    })
  }

  function disconnect (): void {}

  function observerCallback (nodeList: Node[]): void {
    nodeList.forEach((node) => {
      if (matches(node, window.mrujs.remoteSelector)) {
        addTurboFalse(node as Element)
      }

      if (node instanceof Element) {
        node.querySelectorAll(query as string).forEach((el) => {
          addTurboFalse(el)
        })
      }
    })
  }

  return {
    name: 'RemoteWatcher',
    initialize,
    connect,
    disconnect,
    observerCallback
  }
}

function addTurboFalse (el: Element): void {
  if (el == null) return

  if (el.getAttribute('data-turbo') != null) return

  el.setAttribute('data-turbo', 'false')
}
