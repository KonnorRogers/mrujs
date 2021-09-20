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
  fetchRequest: FetchRequestInterface
  request: Request
  fetchResponse?: FetchResponseInterface
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
  remoteSelector: SelectorInterface
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
  queries?: () => EventQueryInterface[]
  callbacks?: Function[]
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
  remoteWatcher: MrujsPluginInterface
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
  enableFormElements: (element: HTMLFormElement) => void
  enableFormElement: (element: HTMLFormElement) => void
  disableElement: (event: Event | HTMLFormElement | Submitter) => void
  addListeners: (conditions: EventQueryInterface[], callbacks: EventListener[]) => void
  removeListeners: (conditions: EventQueryInterface[], callbacks: EventListener[]) => void
  attachObserverCallback: (conditions: EventQueryInterface[], nodeList: Node[], callbacks: EventListener[]) => void
  stopEverything: (event: Event) => void
  dispatch: (this: Node, name: string, options: CustomEventInit) => CustomEvent
  appendToQuerySelector: (key: string, { selector, exclude }: { selector?: string, exclude?: string }) => void
  registerConfirm: (attribute: string, callback: Function) => void
}

export interface FetchResponseInterface {
  succeeded: boolean
  failed: boolean
  redirected: boolean
  clientError: boolean
  serverError: boolean
  status: number
  location: URL
  contentType: string | null
  isHtml: boolean
  isJson: boolean
  response: Response

  getHeader: (name: string) => string | null
  text: () => Promise<string>
  html: () => Promise<string>
  json: () => Promise<JSON>
}

export type RequestInfo = Request | string | URL
export type FetchRequestBody = URLSearchParams | ReadableStream<Uint8Array>

export interface FetchRequestInterface {
  request: Request
  method: string
  url: URL
  body: FetchRequestBody
  params: URLSearchParams
  abortController: AbortController
  abortSignal: AbortSignal
  isGetRequest: boolean
  cancel: (event?: CustomEvent) => void
}

export interface Adapter {
  visit: (location: Locateable, { action }: { action: VisitAction }) => void
  clearCache: () => void

  // Turbolinks
  supported?: boolean
  Snapshot: {
    wrap: (str: string) => string
  }
  controller: {
    cache: SnapshotCacheInterface
  }

  // Turbo
  PageSnapshot?: {
    fromHTMLString: (str: string) => string
  }
  navigator: {
    view: {
      snapshotCache: SnapshotCacheInterface
    }
  }
}

export type VisitAction = 'advance' | 'replace' | 'restore'
