import { ExtendedSubmitEvent, Submitter } from '../../../types'
import { mrujs } from '../mrujs'
import { DirectUploadsController } from './direct_uploads_controller'
import { findElement } from './helpers'

const processingAttribute = 'data-direct-uploads-processing'
const stopSubmittingAttribute = 'data-ujs-submit'
const submitButtonsByForm = new WeakMap()
let started = false

export function connect (): void {
  if (!started) {
    started = true
    document.addEventListener('submit', didSubmitForm, true)
    document.addEventListener('ajax:before', didSubmitRemoteElement)
  }
}

export function disconnect (): void {
  started = false
  document.removeEventListener('submit', didSubmitForm, true)
  document.removeEventListener('ajax:before', didSubmitRemoteElement)
}

function didSubmitForm (event: Event): void {
  handleFormSubmissionEvent(event)
}

function didSubmitRemoteElement (event: Event): void {
  if ((event.target as HTMLElement).tagName === 'FORM') {
    handleFormSubmissionEvent(event)
  }
}

function handleFormSubmissionEvent (event: Event): void {
  const form = event.target as HTMLFormElement
  const submitter = mrujs().findSubmitter(event as ExtendedSubmitEvent)

  if (form.hasAttribute(processingAttribute)) {
    event.preventDefault()
    return
  }

  const controller = new DirectUploadsController(form)
  const { inputs } = controller

  if (inputs.length > 0) {
    event.preventDefault()
    form.setAttribute(processingAttribute, '')
    preventSubmit(form)
    inputs.forEach(disable)
    controller.start((error: Error) => {
      form.removeAttribute(processingAttribute)
      form.removeAttribute(stopSubmittingAttribute)
      if (error != null) {
        inputs.forEach(enable)
      } else {
        submitForm(form, submitter)
      }
    })
  }
}

function submitForm (form: HTMLFormElement, submitter?: Submitter): void {
  let button = submitter ?? findElement(form, 'input[type=submit], button[type=submit]') as HTMLInputElement

  if (button != null) {
    const disabled = button.disabled
    enable(button as HTMLInputElement)
    button.focus()
    button.click()
    button.disabled = disabled
  } else {
    button = document.createElement('input')
    button.type = 'submit'
    button.style.display = 'none'
    form.appendChild(button)
    button.click()
    form.removeChild(button)
  }
  submitButtonsByForm.delete(form)
}

function disable (element: HTMLInputElement): void {
  element.disabled = true
}

function enable (element: HTMLInputElement): void {
  element.disabled = false
}

function preventSubmit (element: HTMLElement): void {
  element.setAttribute(stopSubmittingAttribute, 'false')
}
