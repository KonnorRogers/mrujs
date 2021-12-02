export type Locateable = URL | string
export type AddOrRemoveListeners = 'addEventListener' | 'removeEventListener'
export type Submitter = HTMLInputElement | HTMLButtonElement | null | undefined

export interface EventQueryInterface {
  event: string
  selectors: SelectorType[]
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

export interface QuerySelectorInterface {
  remoteSelector: SelectorType
  linkClickSelector: SelectorType
  buttonClickSelector: SelectorType
  inputChangeSelector: SelectorType
  formSubmitSelector: SelectorType
  formInputClickSelector: SelectorType
  formDisableSelector: SelectorType
  formEnableSelector: SelectorType
  linkDisableSelector: SelectorType
  buttonDisableSelector: SelectorType
  fileInputSelector: SelectorType
}

export interface SelectorInterface {
  selector: string
  exclude: string
}

export type SelectorType = string | SelectorInterface

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
  connect?: () => void
  disconnect?: () => void
  observerCallback?: (addedNodes: Node[]) => void
  queries?: EventQueryInterface[]
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

export interface MrujsInterface extends QuerySelectorInterface {
  // From Rails-UJS
  ['$']: (selector: string) => Element[]
  csrfToken: () => string | undefined
  csrfParam: () => string | undefined
  CSRFProtection: (request: Request) => void
  cspNonce: () => string | undefined
  disableElement: (event: Event | HTMLFormElement | Submitter) => void
  delegate: (element: Element, selector: SelectorType, eventType: string, handler: Function) => void
  fire: (element: EventTarget, name: string, options: CustomEventInit) => boolean
  enableElement: (trigger: Event | HTMLElement) => void
  enableFormElements: (element: HTMLFormElement) => void
  enableFormElement: (element: HTMLFormElement) => void
  stopEverything: (event: Event) => void
  start: (this: MrujsInterface, config?: Partial<MrujsInterface>) => MrujsInterface
  confirm: (message: string) => boolean
  preventInsignificantClick: (event: MouseEvent) => void
  handleConfirm: (event: Event) => void
  handleDisabledElement: (this: HTMLFormElement, event: Event) => void
  handleMethod: (event: Event) => void
  refreshCSRFTokens: () => void
  formElements: (form: HTMLElement, selector: SelectorType) => HTMLFormElement[]
  matches: (element: Node | Element, selector: SelectorType) => boolean
  toArray: <T> (value: any) => T[]

  // New fields
  FetchResponse: (response: Response) => FetchResponseInterface
  FetchRequest: (input: Request | Locateable, options: RequestInit) => FetchRequestInterface
  maskLinkMethods: boolean
  mimeTypes: MimeTypeInterface
  connected: boolean
  findSubmitter: (event: ExtendedSubmitEvent) => Submitter | undefined

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

  // Functions
  stop: () => void
  fetch: (input: Request | Locateable, options?: ExtendedRequestInit) => undefined | Promise<Response>
  restart: () => void
  urlEncodeFormData: (formData: FormData) => URLSearchParams
  registerMimeTypes: (mimeTypes: CustomMimeTypeInterface[]) => MimeTypeInterface
  addListeners: (conditions: EventQueryInterface[], callbacks: EventListener[]) => void
  removeListeners: (conditions: EventQueryInterface[], callbacks: EventListener[]) => void
  attachObserverCallback: (conditions: EventQueryInterface[], nodeList: Node[], callbacks: EventListener[]) => void
  expandUrl: (locateable: Locateable) => URL

  dispatch: (this: Node | EventTarget, name: string, options: CustomEventInit) => CustomEvent
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
  json: () => Promise<Record<string, unknown>>
}

export type RequestInfo = Request | string | URL

// https://developer.mozilla.org/en-US/docs/Web/API/Request
export type FetchRequestBody = Blob | BufferSource | FormData | URLSearchParams | ReadableStream | undefined

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
  headers: Headers
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

export interface ExtendedSubmitEvent extends CustomEvent {
  submitter: Submitter
  detail: {
    submitter?: Submitter
  }
}

