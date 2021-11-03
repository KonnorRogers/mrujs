import { DirectUpload } from './direct_upload'
import { dispatchEvent } from './helpers'

interface UploadEvent extends Event {
  total: number
  loaded: number
}

interface DirectUploadEventInit extends CustomEventInit {
  error?: Error
  file?: File
  id?: number
  xhr?: XMLHttpRequest
}

export class DirectUploadController {
  file: File
  input: HTMLInputElement
  directUpload: DirectUpload
  [key: string]: unknown

  constructor (input: HTMLInputElement, file: File) {
    this.input = input
    this.file = file

    if (this.url == null) {
      throw new Error('No direct upload url found. Aborting...')
    }

    this.directUpload = new DirectUpload(this.file, this.url, this)
    this.dispatch('initialize')
  }

  start (callback: Function): void {
    const hiddenInput = document.createElement('input')
    hiddenInput.type = 'hidden'
    hiddenInput.name = this.input.name
    this.input.insertAdjacentElement('beforebegin', hiddenInput)

    this.dispatch('start')

    this.directUpload.create((error: Error, attributes: Record<string, string>) => {
      if (error != null) {
        hiddenInput?.parentNode?.removeChild(hiddenInput)
        this.dispatchError(error)
      } else {
        hiddenInput.value = attributes.signed_id
      }

      this.dispatch('end')
      callback(error)
    })
  }

  uploadRequestDidProgress (event: UploadEvent): void {
    const progress = event.loaded / event.total * 100
    const detail: Record<string, unknown> = {}
    detail.progress = progress
    if (progress != null) {
      this.dispatch('progress', detail)
    }
  }

  get url (): string | null | undefined {
    return this.input.getAttribute('data-direct-upload-url')
  }

  dispatch (name: string, detail: DirectUploadEventInit = {}): CustomEvent {
    detail.file = this.file
    detail.id = this.directUpload.id
    return dispatchEvent(this.input, `direct-upload:${name}`, { detail })
  }

  dispatchError (error: Error): void {
    const event = this.dispatch('error', { error })
    if (!event.defaultPrevented) {
      // TODO: Alerts are bad. Don't do this.
      alert(error)
    }
  }

  // DirectUpload delegate
  directUploadWillCreateBlobWithXHR (xhr: XMLHttpRequest): void {
    this.dispatch('before-blob-request', { xhr })
  }

  directUploadWillStoreFileWithXHR (xhr: XMLHttpRequest): void {
    this.dispatch('before-storage-request', { xhr })
    xhr.upload.addEventListener('progress', (event: UploadEvent) => this.uploadRequestDidProgress(event))
  }
}
