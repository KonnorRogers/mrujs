const template = `
<style>
:host {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.75);
  --mrujs-confirm: 101 218 251;
  --mrujs-confirm-hover: 131 238 251;
  --mrujs-cancel: 40 40 40;
  --mrujs-cancel-hover: 80 80 90;
  --mrujs-background: 66 65 76;
  --monospace: 'SFMono-Regular', Consolas,
              'Liberation Mono', Menlo, Courier, monospace;
}
.window {
  font-family: var(--monospace);
  line-height: 1.5;
  min-width: 200px;
  width: 75vw;
  max-width: 500px;
  color: white;
  margin: 30vh auto 0 auto;
  padding: 25px 40px;
  position: relative;
  background: rgb(var(--mrujs-background));
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
}

.text {
  font-size: 1rem;
  min-height: 50px;
}

.button-group {
  font-size: 1.1rem;
  display: inline-flex;
  justify-content: flex-end;
  width: 100%;
}

.button-group > button {
  padding: 0.5em 1.25em;
  margin-right: 1rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
}

.button-group > button:last-child {
  margin-right: 0;
}

#cancel {
  background-color: rgb(var(--mrujs-cancel));
  color: white;
}

#cancel:hover,
#cancel:focus {
  background-color: rgb(var(--mrujs-cancel-hover));
}

#confirm {
  background-color: rgb(var(--mrujs-confirm));
}

#confirm:hover,
#confirm:focus {
  background-color: rgb(var(--mrujs-confirm-hover));
}

</style>

<div part="base" class="window">
  <div part="text" class="text">
    <slot></slot>
  </div>

  <div part="buttons" class="button-group">
    <button part="cancel" id="cancel">
      Cancel
    </button>

    <button part="confirm" id="confirm">
      OK
    </button>
  </div>
</div>
`

export class MrujsConfirmElement extends HTMLElement {
  boundConfirm = this.confirm.bind(this)
  boundCancel = this.cancel.bind(this)

  public static get observedAttributes (): string[] {
    return ['confirm-text', 'cancel-text']
  }

  constructor () {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = template

    shadowRoot.querySelector('.window')?.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    this.addEventListener('click', () => {
      this.close()
      this.dispatchEvent(new MrujsConfirmEvent(false))
    })
  }

  connectedCallback (): void {
    if (this.confirmButton != null) {
      this.confirmButton.innerText = this.confirmText
      this.confirmButton.addEventListener('click', this.boundConfirm)
    }

    if (this.cancelButton != null) {
      this.cancelButton.innerText = this.cancelText
      this.cancelButton.addEventListener('click', this.boundCancel)
    }
  }

  disconnectedCallback (): void {
    this.confirmButton?.removeEventListener('click', this.boundConfirm)
    this.cancelButton?.removeEventListener('click', this.boundCancel)
  }

  close (): void {
    this.parentNode?.removeChild(this)
  }

  confirm (): void {
    this.close()
    this.dispatchEvent(new MrujsConfirmEvent(true))
  }

  cancel (): void {
    this.close()
    this.dispatchEvent(new MrujsConfirmEvent(false))
  }

  attributeChangedCallback (name: string, _oldValue: string, newValue: string): void {
    switch (name) {
      case 'confirm-text':
        if (this.confirmButton != null) {
          this.confirmButton.innerText = newValue
        }
        break
      case 'cancel-text':
        if (this.cancelButton != null) {
          this.cancelButton.innerText = newValue
        }
        break
    }
  }

  get confirmButton (): HTMLButtonElement | undefined {
    if (this.shadowRoot == null) return undefined
    return this.shadowRoot.querySelector('#confirm') as HTMLButtonElement
  }

  get cancelButton (): HTMLButtonElement | undefined {
    if (this.shadowRoot == null) return undefined
    return this.shadowRoot.querySelector('#cancel') as HTMLButtonElement
  }

  get confirmText (): string {
    const confirmText = this.getAttribute('confirm-text')

    if (confirmText == null) {
      this.confirmText = 'OK'
      return this.confirmText
    }

    return confirmText
  }

  set confirmText (val: string) {
    this.setAttribute('confirm-text', val)
  }

  get cancelText (): string {
    const cancelText = this.getAttribute('cancel-text')

    if (cancelText == null) {
      this.cancelText = 'Cancel'
      return this.cancelText
    }

    return cancelText
  }

  set cancelText (val: string) {
    this.setAttribute('cancel-text', val)
  }
}

export class MrujsConfirmEvent extends Event {
  answer: boolean | undefined

  constructor (answer: boolean) {
    super('confirm:complete', { bubbles: true, composed: true, cancelable: false })
    this.answer = answer
  }
}

window.customElements.define('mrujs-confirm', MrujsConfirmElement)

// async function asyncConfirm (message: string): Promise<boolean> {
//   const dialog = document.createElement('mrujs-confirm')
//   dialog.innerText = message
//   document.body.appendChild(dialog)

//   return await new Promise((resolve) => {
//     function handleConfirmComplete (event: MrujsConfirmEvent): void {
//       dialog.removeEventListener('confirm:complete', handleConfirmComplete as EventListener)
//       const answer = !!(event.answer ?? false)
//       resolve(answer)
//     }
//     dialog.addEventListener('confirm:complete', handleConfirmComplete as EventListener)
//   })
// }
