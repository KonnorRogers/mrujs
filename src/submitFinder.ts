import { Submitter } from '../types'

export interface ExtendedSubmitEvent extends CustomEvent {
  submitter: Submitter
  detail: {
    submitter?: Submitter
  }
}

export function findSubmitter (event: ExtendedSubmitEvent): Submitter | undefined {
  // Not supported by webkit
  if (event.submitter instanceof HTMLElement) {
    return event.submitter
  }

  // we have a polyfill that adds submitter on event.detail
  return event.detail.submitter
}
