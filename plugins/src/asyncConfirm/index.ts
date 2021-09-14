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

function connect (): void { }
function disconnect (): void { }

function handleAsyncConfirm (event: Event): void {
  let element = event.currentTarget as HTMLElement

  if (element == null) return

  // @ts-expect-error
  if (element.dataset.asyncConfirmSkip === 'true' || event.submitter?.dataset?.asyncConfirmSkip === 'true') return

  const message = element.dataset.asyncConfirm

  if (message == null) return

  // this requires some thought.
  const eventType = event.type
  if (eventType === 'change') return

  // @ts-expect-error
  const mrujs = window.mrujs
  mrujs.stopEverything(event)

  asyncConfirm(message, element).then((answer) => {
    if (answer) {
      mrujs.dispatch.call(element, 'confirm:complete', { detail: { answer } })

      // if (eventType === "click")
      if (eventType === 'submit') {
        // @ts-expect-error
        element = event.submitter
      }

      element.dataset.asyncConfirmSkip = 'true'
      element.click()
      element.removeAttribute('data-async-confirm-skip')

      // Need to think through change events.
      // if (eventType === 'change') { element.addEventListener(eventType, handleAsyncConfirm as EventListener) }
    } else {
      mrujs.dispatch.call(element, 'confirm:complete', { detail: { answer } })
    }
  }).catch((_) => mrujs.stopEverything(event))
}

async function asyncConfirm (message: string, element?: HTMLElement): Promise<boolean> {
  const dialog = document.createElement('mrujs-confirm')
  dialog.innerText = message

  if (element != null) {
    if (element.dataset.asyncConfirmOk != null) dialog.setAttribute('confirm-text', element.dataset.asyncConfirmOk)
    if (element.dataset.asyncConfirmCancel != null) dialog.setAttribute('cancel-text', element.dataset.asyncConfirmCancel)
  }

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
