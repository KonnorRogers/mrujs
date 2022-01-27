import { ExtendedSubmitEvent, Submitter } from './types'

export function findSubmitter (event: ExtendedSubmitEvent): Submitter {
  // Not supported by webkit
  if (event.submitter instanceof HTMLElement) {
    return event.submitter
  }

  // we have a polyfill that adds submitter on event.detail
  return event.detail?.submitter
}
