import { MrujsPluginInterface, MrujsInterface } from '../../types'

export function Shoelace (): MrujsPluginInterface {
  return {
    name: 'Shoelace',
    connect,
    disconnect
  }
}

function connect (): void {
  document.addEventListener('sl-submit', shoelaceFormListener as EventListener)
}

function disconnect (): void {
  document.removeEventListener('sl-submit', shoelaceFormListener as EventListener)
}

function shoelaceFormListener (event: CustomEvent): void {
  const form = event.target as HTMLFormElement
  const formData = event.detail.formData

  const action = form.getAttribute('action')
  let method = form.getAttribute('method')

  if (action == null) {
    console.warn("No 'action' attribute on your Shoelace form. Aborting...")
    return
  }

  if (method == null) method = 'get'

  const mrujs = (): MrujsInterface => window.mrujs
  mrujs().fetch(action, {
    element: form,
    dispatchEvents: true,
    method: method,
    body: mrujs().urlEncodeFormData(formData)
  }).then(() => {}).catch((err: string) => console.warn(err))
}
