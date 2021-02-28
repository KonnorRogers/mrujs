/**
 * Find who submitted an event
 */
export function findSubmitter(event) {
  // Not supported by webkit
  if (event.submitter) {
    return event.submitter;
  }

  if (event.detail) {
    return event.detail.submitter;
  }

  // Webkit fallback
  return event.target.querySelector("[type='submit']");
}

/**
 * Disables whatever button submitted the form. Will change innerText to the
 *   value of data-disable-with
 * @return void
 */
export function disableSubmitter(event) {
  const submitter = findSubmitter(event);

  // Fetches arent always fired by a form, lets account for this.
  if (!submitter) {
    return;
  }

  submitter.disabled = true;
  submitter.dataset.mrujsEnabled = 'false';
  submitter.dataset.mrujsDisabled = 'true';
  submitter.dataset.mrujsEnableWith = submitter.innerText;

  const disabledText = submitter.dataset.disableWith;

  if (disabledText) {
    submitter.innerText = disabledText;
  }
}

/**
 * Reenables whatever submitted the button and reverts the innerText.
 * @return void
 */
export function enableSubmitter(event) {
  const submitter = findSubmitter(event);
  // Fetches arent always fire by a form, lets account for this.
  if (!submitter) {
    return;
  }

  submitter.disabled = false;

  submitter.innerText = submitter.dataset.mrujsEnableWith;
  submitter.dataset.mrujsEnabled = 'true';
  submitter.dataset.mrujsDisabled = 'false';
}
