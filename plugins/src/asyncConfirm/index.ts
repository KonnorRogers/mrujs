import { MrujsConfirmEvent, MrujsConfirmElement } from './customElement'

export function AsyncConfirm (): Record<string, unknown> {
  return {
    name: 'AsyncConfirm',
    initialize,
    connect,
    disconnect
  }
}

function initialize (): void {
  window.customElements.define('mrujs-confirm', MrujsConfirmElement)

  // @ts-expect-error
  window.mrujs.registerConfirm('data-async-confirm', handleAsyncConfirm)
}

function connect (): void {}
function disconnect (): void {}

async function handleAsyncConfirm (event: Event): Promise<void> {
  const element = event.currentTarget as HTMLElement

  if (event.currentTarget == null) return

  const message = element.dataset.asyncConfirm

  if (message == null) return

  // this requires some thought.
  const eventType = event.type
  if (eventType === 'change') return

  // @ts-expect-error
  const mrujs = window.mrujs
  mrujs.stopEverything(event)

  let answer = false

  answer = await asyncConfirm(message)

  if (answer) {
    element.removeEventListener(eventType, handleAsyncConfirm as EventListener)
    mrujs.dispatch.call(element, 'confirm:complete', { detail: { answer } })

    if (eventType === 'click') element.click()
    if (eventType === 'submit') (element as HTMLFormElement).requestSubmit()
    // Need to think through change events.
    // if (eventType === 'change') { element.addEventListener(eventType, handleAsyncConfirm as EventListener) }
  }
}

async function asyncConfirm (message: string): Promise<boolean> {
  const dialog = document.createElement('mrujs-confirm')
  dialog.innerText = message
  document.body.appendChild(dialog)

  return await new Promise((resolve) => {
    function handleConfirmComplete (event: MrujsConfirmEvent): void {
      dialog.removeEventListener('confirm:complete', handleConfirmComplete as EventListener)
      const answer = !!(event.answer ?? false)
      resolve(answer)
    }
    dialog.addEventListener('confirm:complete', handleConfirmComplete as EventListener)
  })
}
