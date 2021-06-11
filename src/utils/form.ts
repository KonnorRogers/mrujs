import { Submitter } from '../types'

export function buildFormElementFormData (element: HTMLFormElement, submitter?: Submitter): FormData {
  const formData = new FormData(element)
  const name = submitter?.getAttribute('name')
  const value = submitter?.getAttribute('value')

  if (name != null && value != null && formData.get(name) !== value) {
    formData.append(name, value)
  }

  return formData
}

export enum FormEncType {
  urlEncoded = 'application/x-www-form-urlencoded',
  multipart = 'multipart/form-data',
  plain = 'text/plain'
}

export function formEnctypeFromString (encoding: string): FormEncType {
  switch (encoding.toLowerCase()) {
    case FormEncType.multipart: return FormEncType.multipart
    case FormEncType.plain: return FormEncType.plain
    default: return FormEncType.urlEncoded
  }
}

export function formDataToStrings (formData: FormData): Array<[string, string]> | undefined {
  return [...formData].reduce<Array<[string, string]>>((entries, [name, value]) => {
    return entries.concat(typeof value === 'string' ? [[name, value]] : [])
  }, [])
}
