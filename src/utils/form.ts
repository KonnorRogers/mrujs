import { Submitter } from '../types'

export function buildFormData (element: HTMLFormElement, submitter?: Submitter): FormData {
  const formData = new FormData(element)
  const name = submitter?.getAttribute('name')
  const value = submitter?.getAttribute('value')

  if (name != null && value != null && formData.get(name) !== value) {
    formData.append(name, value)
  }

  return formData
}
