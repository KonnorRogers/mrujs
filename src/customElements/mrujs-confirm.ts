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
  background: rgba(0, 0, 0, 0.66);
  --monospace: 'SFMono-Regular', Consolas,
              'Liberation Mono', Menlo, Courier, monospace;
}
.window {
  font-family: var(--monospace);
  line-height: 1.5;
  width: 800px;
  color: #d8d8d8;
  margin: 30px auto;
  padding: 25px 40px;
  position: relative;
  background: #181818;
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
}
pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}
pre::-webkit-scrollbar {
  display: none;
}
</style>
<div class="window">
  <slot></slot>

  <button id="confirm">
    Confirm
  </button>

  <button id="cancel">
    Cancel
  </button>
</div>
`

export class MrujsConfirmElement extends HTMLElement {
  confirmButton!: HTMLButtonElement
  cancelButton!: HTMLButtonElement

  boundConfirm = this.confirm.bind(this)
  boundCancel = this.cancel.bind(this)

  constructor () {
    super()

    const shadowRoot = this.attachShadow({mode: 'open'});
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

    this.confirmButton = this.shadowRoot.querySelector("#confirm") as HTMLButtonElement
    this.cancelButton = this.shadowRoot.querySelector("#cancel") as HTMLButtonElement

    this.confirmButton.addEventListener("click", this.boundConfirm)
    this.cancelButton.addEventListener("click", this.boundCancel)
  }

  disconnectedCallback (): void {
    if (this.shadowRoot == null) return

    this.confirmButton ||= this.shadowRoot.querySelector("#confirm") as HTMLButtonElement
    this.cancelButton ||= this.shadowRoot.querySelector("#cancel") as HTMLButtonElement

    this.confirmButton.removeEventListener("click", this.boundConfirm)
    this.cancelButton.removeEventListener("click", this.boundCancel)
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
    super("confirm:complete", { bubbles: true, composed: true, cancelable: false })
    this.answer = answer
  }
}
