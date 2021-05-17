export interface IQuery {
  event: 'click' | 'change' | 'submit'
  selectors: string[]
}
