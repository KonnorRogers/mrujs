import { DirectUploadController } from './direct_upload_controller'
import { findElements, dispatchEvent, toArray } from './helpers'

const inputSelector = 'input[type=file][data-direct-upload-url]:not([disabled]):not([aria-disabled])'

export class DirectUploadsController {
  form: HTMLFormElement
  inputs: HTMLInputElement[]

  constructor (form: HTMLFormElement) {
    this.form = form
    this.inputs = findElements<HTMLInputElement>(form, inputSelector).filter((input) => input.files != null && input.files.length > 0)
  }

  start (callback: Function): void {
    const controllers = this.createDirectUploadControllers()

    const startNextController = (): void => {
      const controller = controllers.shift()
      if (controller != null) {
        controller.start((error?: Error): void => {
          if (error != null) {
            callback(error)
            this.dispatch('end')
          } else {
            startNextController()
          }
        })
      } else {
        callback()
        this.dispatch('end')
      }
    }

    this.dispatch('start')
    startNextController()
  }

  createDirectUploadControllers (): DirectUploadController[] {
    const controllers: DirectUploadController[] = []
    this.inputs.forEach(input => {
      toArray<File>(input.files).forEach(file => {
        const controller = new DirectUploadController(input, file)
        controllers.push(controller)
      })
    })
    return controllers
  }

  dispatch (name: string, detail = {}): CustomEvent {
    return dispatchEvent(this.form, `direct-uploads:${name}`, { detail })
  }
}
