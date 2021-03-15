export interface ExtendedSubmitEvent extends CustomEvent {
  submitter: HTMLInputElement
  detail: {
    submitter?: HTMLInputElement
  }
}

/**
 * Find who submitted an event
 */
export function findSubmitter (event: ExtendedSubmitEvent): HTMLInputElement | null {
  // Not supported by webkit
  if (event.submitter) {
    return event.submitter
  }

  // This comes from our custom events
  if ((event?.detail?.submitter) != null) {
    return event.detail.submitter
  }

  // Webkit fallback
  const submitter = event?.target as HTMLElement
  return submitter.querySelector("input[type='submit']") as HTMLInputElement
}

/**
 * Disables whatever button submitted the form. Will change innerText to the
 *   value of data-disable-with
 */
export function disableSubmitter (event: ExtendedSubmitEvent) {
  const submitter = findSubmitter(event)

  // Fetches arent always fired by a form, lets account for this.
  if (submitter == null) {
    return
  }

  submitter.disabled = true
  submitter.dataset.mrujsEnabled = 'false'
  submitter.dataset.mrujsDisabled = 'true'
  submitter.dataset.mrujsEnableWith = submitter.innerText

  const disabledText = submitter.dataset.disableWith

  if (disabledText) {
    submitter.innerText = disabledText
  }
}

/**
 * Reenables whatever submitted the button and reverts the innerText.
 */
export function enableSubmitter (event: ExtendedSubmitEvent) {
  const submitter = findSubmitter(event)
  // Fetches arent always fire by a form, lets account for this.
  if (submitter == null) {
    return
  }

  submitter.disabled = false

  if (submitter.dataset.mrujsEnableWith) {
    submitter.innerText = submitter.dataset.mrujsEnableWith
  }

  submitter.dataset.mrujsEnabled = 'true'
  submitter.dataset.mrujsDisabled = 'false'
}
