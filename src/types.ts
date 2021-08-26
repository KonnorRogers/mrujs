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

export interface SnapshotCacheInterface {
  size: number
  keys: string[]
  snapshots: Record<string, unknown>
  put: (location: URL, snapshot: string) => void
  has: (location: URL) => boolean
  [key: string]: unknown
}

export interface ExtendedRequestInit extends RequestInit {
  element?: HTMLElement
  submitter?: HTMLElement
  dispatchEvents?: boolean
}

export interface MrujsInterface {
  connected: boolean
  config: MrujsConfigInterface

  corePlugins: MrujsPluginInterface[]
  plugins: MrujsPluginInterface[]
  allPlugins: MrujsPluginInterface[]

  // Core Plugins
  addedNodesObserver: MrujsPluginInterface
  elementEnabler: MrujsPluginInterface
  elementDisabler: MrujsPluginInterface
  disabledElementChecker: MrujsPluginInterface
  navigationAdapter: MrujsPluginInterface
  clickHandler: MrujsPluginInterface
  confirmClass: MrujsPluginInterface
  csrf: MrujsPluginInterface
  method: MrujsPluginInterface
  formSubmitDispatcher: MrujsPluginInterface

  querySelectors: QuerySelectorInterface
  mimeTypes: MimeTypeInterface
  csrfToken?: string
  csrfParam?: string

  // Functions
  start: (this: MrujsInterface, config: Partial<MrujsConfigInterface>) => MrujsInterface
  confirm: (message: string) => boolean
  stop: () => void
  fetch: (input: Request | Locateable, options: ExtendedRequestInit) => undefined | Promise<Response>
  restart: () => void
  urlEncodeFormData: (formData: FormData) => URLSearchParams
  registerMimeTypes: (mimeTypes: CustomMimeTypeInterface[]) => MimeTypeInterface
  enableElement: (trigger: Event | HTMLElement) => void
  disableElement: (event: Event | HTMLFormElement | Submitter) => void
}
