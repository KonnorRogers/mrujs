import { FetchResponse } from './http/fetchResponse'
import { FetchRequest } from './http/fetchRequest'

export type AddOrRemoveListeners = 'addEventListener' | 'removeEventListener'
export type Submitter = HTMLInputElement | HTMLButtonElement

export interface IQuery {
  event: 'click' | 'change' | 'submit'
  selectors: string[]
}

export interface AjaxEventDetail {
  element: HTMLFormElement
  fetchRequest: FetchRequest
  request: Request
  fetchResponse?: FetchResponse
  response?: Response
  submitter?: FetchResponse
  error?: Error
}
