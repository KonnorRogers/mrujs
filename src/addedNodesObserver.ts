import { MrujsPluginInterface } from './types'

/**
 * Mutation observer for added nodes.
 */
export function AddedNodesObserver (callback: MutationCallback): MrujsPluginInterface {
  const observer = new MutationObserver(callback)

  function connect (): void {
    observer.observe(document, { childList: true, subtree: true, attributes: true })
  }

  function disconnect (): void {
    observer.disconnect()
  }

  return {
    name: 'AddedNodesObserver',
    connect,
    disconnect
  }
}
