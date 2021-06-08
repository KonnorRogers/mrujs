import { Submitter } from './types'

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

  return event.detail.submitter
}

/**
 * Disables whatever button submitted the form. Will change innerText to the
 *   value of data-disable-with
 */
export function disableSubmitter (event: ExtendedSubmitEvent): void {
  const submitter = findSubmitter(event)

  if (submitter == null) {
    return
  }

  submitter.disabled = true
  submitter.dataset.mrujsEnabled = 'false'
  submitter.dataset.mrujsDisabled = 'true'
  submitter.dataset.mrujsEnableWith = submitter.innerText

  const disabledText = submitter.dataset.disableWith

  if (disabledText == null) return

  submitter.innerText = disabledText
}

/**
 * Reenables whatever submitted the button and reverts the innerText.
 */
export function enableSubmitter (event: ExtendedSubmitEvent): void {
  const submitter = findSubmitter(event)
  // Fetches arent always fire by a form, lets account for this.
  if (submitter == null) {
    return
  }

  submitter.disabled = false

  const enableWith = submitter.dataset.mrujsEnableWith
  if (typeof enableWith === 'string') {
    submitter.innerText = enableWith
  }

  submitter.dataset.mrujsEnabled = 'true'
  submitter.dataset.mrujsDisabled = 'false'
}
