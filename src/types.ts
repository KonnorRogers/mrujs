import { FetchResponse } from './http/fetchResponse'
import { FetchRequest } from './http/fetchRequest'
export type Locateable = URL | string
export type AddOrRemoveListeners = 'addEventListener' | 'removeEventListener'
export type Submitter = HTMLInputElement | HTMLButtonElement

export interface EventQueryInterface {
  event: string
  selectors: string[]
}

export interface AjaxEvent extends CustomEvent, Event {
  detail: AjaxEventDetail
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
  maskLinkMethods: boolean
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
  initialize?: () => void
  connect: () => void
  disconnect: () => void
  observerCallback?: (addedNodes: Node[]) => void
}

export interface ExposedUtilsInterface {
  match: Function
  FetchRequest: FetchRequest['constructor']
  FetchResponse: FetchResponse['constructor']
}

export interface SnapshotCacheInterface {
  size: number
  keys: string[]
  snapshots: Record<string, unknown>
  put: (location: URL, snapshot: string) => void
  has: (location: URL) => boolean
  [key: string]: unknown
}
