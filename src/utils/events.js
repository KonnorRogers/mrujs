export const EVENT_DEFAULTS = {
  bubbles: true,
  cancelable: true,
};

/**
 * Thin wrapper around element.dispatchEvent and new CustomEvent
 * @param {string} name - The name of the event
 * @param {object} options - Any options you can pass to CustomEvent
 */
export function dispatch(name, options = {}) {
  this.dispatchEvent(new CustomEvent(name, options));
}

const prefix = 'ajax';

export const AJAX_EVENTS = {
  /**
   * Before the ajax event gets sent.
   * You can view what data will be sent via: `event.detail.formData`
   */
  ajaxBefore: `${prefix}:before`,

  /**
   * When the fetch request is sent. You can view whats being sent via:
   * `event.detail.formData`
   */
  ajaxSend: `${prefix}:send`,

  /**
   * When a response error occurs. IE: 400, 404, 422, 500, etc (any status code not between 200 - 299)
   * The response error can be viewed via: `event.detail.response`
   */
  ajaxResponseError: `${prefix}:response:error`,

  /**
   * When a >= 200 and <= 299 response is returned
   * You can view the full response via: `event.detail.response`
   */
  ajaxSuccess: `${prefix}:success`,

  /**
   * When an actual error is raised. This doesnt include 404, 500,
   * errors, just like native fetch.
   * You can view the error via: `event.detail.error`
   * This will also generate an error in your console.log
   */
  ajaxError: `${prefix}:error`,

  /**
   * After any fetch request, regardless of outcome
   * Does not have any accessible data besides the event itself
   */
  ajaxComplete: `${prefix}:complete`,

  // NOT CURRENTLY IMPLEMENTED
  // /**
  //  * when there are blank required fields in a form, submits anyway if stopped
  //  */
  // ajaxAbortedRequired: `${prefix}:aborted:required`,

  // /**
  //  * if there are non-blank input:file fields in a form, aborts if stopped
  //  */
  // ajaxAbortedFile: `${prefix}:aborted:file`
};
