import { Submitter } from '../types'

export function buildFormElementFormData (element: HTMLFormElement, submitter?: Submitter): FormData {
  const formData = new FormData(element)

  let name
  let value

  if (submitter != null) {
    name = submitter.getAttribute('name')
    value = submitter.getAttribute('value')
  }

  if (name != null && value != null && formData.get(name) !== value) {
    formData.append(name, value)
  }

  return formData
}

export type FormEncType = 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'

export const FormEncTypes = {
  urlEncoded: 'application/x-www-form-urlencoded' as FormEncType,
  multipart: 'multipart/form-data' as FormEncType,
  plain: 'text/plain' as FormEncType
}

export function formEnctypeFromString (encoding: string): FormEncType {
  switch (encoding.toLowerCase()) {
    case FormEncTypes.multipart: return FormEncTypes.multipart
    case FormEncTypes.plain: return FormEncTypes.plain
    default: return FormEncTypes.urlEncoded
  }
}

export function formDataToStrings (formData: FormData): Array<[string, string]> | undefined {
  return [...formData].reduce<Array<[string, string]>>((entries, [name, value]) => {
    return entries.concat(typeof value === 'string' ? [[name, value]] : [])
  }, [])
}

export function urlEncodeFormData (formData: FormData): URLSearchParams {
  return new URLSearchParams(formDataToStrings(formData))
}
