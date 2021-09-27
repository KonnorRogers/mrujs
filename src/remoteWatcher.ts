import { MrujsPluginInterface } from './types'
import { match } from './utils/dom'

export function RemoteWatcher (): MrujsPluginInterface {
  const query = window.mrujs.querySelectors.remoteSelector.selector

  function connect (): void {
    document.querySelectorAll(query).forEach((el): void => {
      addTurboFalse(el)
    })
  }

  function disconnect (): void {}

  function observerCallback (nodeList: Node[]): void {
    nodeList.forEach((node) => {
      if (match(node, window.mrujs.querySelectors.remoteSelector)) {
        addTurboFalse(node as Element)
      }

      if (node instanceof Element) {
        node.querySelectorAll(query).forEach((el) => {
          addTurboFalse(el)
        })
      }
    })
  }

  return {
    name: 'RemoteWatcher',
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
