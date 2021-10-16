import { MrujsPluginInterface } from '../../types'

export function Shoelace (): MrujsPluginInterface {
  return {
    name: 'Shoelace',
    initialize,
    disconnect
  }
}

function initialize (): void {
  document.addEventListener('sl-submit', shoelaceFormListener as EventListener)
}

function disconnect (): void {
  document.removeEventListener('sl-submit', shoelaceFormListener as EventListener)
}

function shoelaceFormListener (event: CustomEvent): Promise<void> {
  const form = event.currentTarget as HTMLFormElement
  const formData = event.detail.formData

  const action = form.getAttribute('action')
  let method = form.getAttribute('method')

  if (action == null) {
    console.warn("No 'action' attribute on your Shoelace form. Aborting...")
    return
  }

  if (method == null) method = 'get'

  window.mrujs.fetch(action, {
    element: form,
    dispatchEvents: true,
    method: method,
    body: window.mrujs.urlEncodeFormData(formData)
  })
}
