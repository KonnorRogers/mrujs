import { FetchResponse } from './http/fetchResponse'
import { FetchRequest } from './http/fetchRequest'

export type AddOrRemoveListeners = 'addEventListener' | 'removeEventListener'
export type Submitter = HTMLInputElement | HTMLButtonElement

export interface EventQueryInterface {
  event: 'click' | 'change' | 'submit'
  selectors: string[]
}

export interface AjaxEventDetail {
  element: HTMLFormElement
  fetchRequest: FetchRequest
  request: Request
  fetchResponse?: FetchResponse
  response?: Response
  submitter?: Submitter
  error?: Error
}

export interface MrujsConfigInterface {
  querySelectors: QuerySelectorInterface
  mimeTypes: MimeTypeInterface
  plugins: MrujsPluginInterface[]
}

export interface QuerySelectorInterface {
  linkClickSelector: SelectorInterface
  buttonClickSelector: SelectorInterface
  inputChangeSelector: SelectorInterface
  formSubmitSelector: SelectorInterface
  formInputClickSelector: SelectorInterface
  formDisableSelector: SelectorInterface
  formEnableSelector: SelectorInterface
  linkDisableSelector: SelectorInterface
  buttonDisableSelector: SelectorInterface
}

export interface SelectorInterface {
  selector: string
  exclude?: string
}

export interface CustomMimeTypeInterface {
  shortcut: string
  header: string
}

export interface MimeTypeInterface {
  [key: string]: string
}

export interface MrujsPluginInterface {
  name: string
  connect: () => void
  disconnect: () => void
}

export interface ExposedUtilsInterface {
  match: Function
  FetchRequest: FetchRequest['constructor']
  FetchResponse: FetchResponse['constructor']
}
