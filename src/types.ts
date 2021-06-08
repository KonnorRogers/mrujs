export type AddOrRemoveListeners = 'addEventListener' | 'removeEventListener'
export type Submitter = HTMLInputElement | HTMLButtonElement

export interface IQuery {
  event: 'click' | 'change' | 'submit'
  selectors: string[]
}
