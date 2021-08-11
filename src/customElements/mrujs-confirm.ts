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
  confirmButton!: HTMLButtonElement
  cancelButton!: HTMLButtonElement

  boundConfirm = this.confirm.bind(this)
  boundCancel = this.cancel.bind(this)

  public static get observerAttributes (): string[] {
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
    if (this.shadowRoot == null) return

    this.confirmButton = this.shadowRoot.querySelector('#confirm') as HTMLButtonElement
    this.cancelButton = this.shadowRoot.querySelector('#cancel') as HTMLButtonElement

    this.confirmButton.addEventListener('click', this.boundConfirm)
    this.cancelButton.addEventListener('click', this.boundCancel)
  }

  disconnectedCallback (): void {
    if (this.shadowRoot == null) return

    this.confirmButton ||= this.shadowRoot.querySelector('#confirm') as HTMLButtonElement
    this.cancelButton ||= this.shadowRoot.querySelector('#cancel') as HTMLButtonElement

    this.confirmButton.removeEventListener('click', this.boundConfirm)
    this.cancelButton.removeEventListener('click', this.boundCancel)
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
}

export class MrujsConfirmEvent extends Event {
  answer: boolean | undefined

  constructor (answer: boolean) {
    super('confirm:complete', { bubbles: true, composed: true, cancelable: false })
    this.answer = answer
  }
}
