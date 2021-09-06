import { MrujsInterface, MrujsPluginInterface } from '../../../src/types'
// import { MrujsConfirmEvent, MrujsConfirmElement } from './customElement'
import { MrujsConfirmElement } from './customElement'

export const plugin: MrujsPluginInterface = {
  name: 'AsyncConfirm',
  initialize,
  connect,
  disconnect
}

// const mrujs = window.mrujs

function initialize (): void {
  window.customElements.define('mrujs-confirm', MrujsConfirmElement)

  // window.mrujs.registerConfirm('data-async-confirm', handleAsyncConfirm)
}

function connect (): void {}
function disconnect (): void {}

// async function handleAsyncConfirm (event: Event): Promise<void> {
//   if (event.currentTarget == null) return // false

//   const element = event.currentTarget as HTMLElement
//   const message = element.dataset.asyncConfirm
//   const eventType = event.type

//   if (message == null) return

//   mrujs.stopEverything(event)

//   let answer = false

//   answer = await asyncConfirm(message)

//   if (answer) {
//     mrujs.dispatch.call(element, 'confirm:complete', { detail: { answer } })
//     element.removeEventListener(eventType, handleAsyncConfirm as EventListener)
//     element.click()
//     element.addEventListener(eventType, handleAsyncConfirm as EventListener)
//   }
// }

// async function asyncConfirm (message: string): Promise<boolean> {
//   const dialog = document.createElement('mrujs-confirm')
//   dialog.innerText = message
//   document.body.appendChild(dialog)

//   return await new Promise((resolve) => {
//     function handleConfirmComplete (event: MrujsConfirmEvent) {
//       dialog.removeEventListener('confirm:complete', handleConfirmComplete as EventListener)
//       const answer = !!(event.answer ?? false)
//       resolve(answer)
//     }
//     dialog.addEventListener('confirm:complete', handleConfirmComplete as EventListener)
//   })
// }

declare global {
  interface Window {
    mrujs: MrujsInterface
  }
}
