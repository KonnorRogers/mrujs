import { dispatch, EVENT_DEFAULTS, AJAX_EVENTS } from './utils/events.js';
import { findSubmitter } from './submitToggle.js';
import Csrf from './csrf.js';

export default class Ajax {
  static acceptHeaders() {
    return {
      '*': '*/*',
      any: '*/*',
      text: 'text/plain',
      html: 'text/html',
      xml: 'application/xml, text/xml',
      json: 'application/json, text/javascript',
      script:
        'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
    };
  }

  connect() {
    // Picks up the submit event
    document.addEventListener('submit', this._ajaxSubmit.bind(this));

    // Dispatchs an `ajax:before` event, which then triggers a fetch request
    document.addEventListener(
      AJAX_EVENTS.ajaxBefore,
      this._sendFetchRequest.bind(this)
    );

    // After the fetch request is triggered, itll send the appropriate evnet response:
    // IE: `ajax:error`, `ajax:success`, `ajax:response:error`
    document.addEventListener(
      AJAX_EVENTS.ajaxSend,
      this._dispatchResponse.bind(this)
    );

    // Listen for all 3 possible response and then send out a complete event
    document.addEventListener(
      AJAX_EVENTS.ajaxSuccess,
      this._dispatchComplete.bind(this)
    );
    document.addEventListener(
      AJAX_EVENTS.ajaxResponseError,
      this._dispatchComplete.bind(this)
    );
    document.addEventListener(
      AJAX_EVENTS.ajaxError,
      this._dispatchComplete.bind(this)
    );
  }

  disconnect() {
    document.removeEventListener('submit', this._ajaxSubmit.bind(this));

    document.removeEventListener(
      AJAX_EVENTS.ajaxBefore,
      this._sendFetchRequest.bind(this)
    );

    document.removeEventListener(
      AJAX_EVENTS.ajaxSend,
      this._dispatchResponse.bind(this)
    );

    document.removeEventListener(
      AJAX_EVENTS.ajaxSuccess,
      this._dispatchComplete.bind(this)
    );
    document.removeEventListener(
      AJAX_EVENTS.ajaxResponseError,
      this._dispatchComplete.bind(this)
    );
    document.removeEventListener(
      AJAX_EVENTS.ajaxError,
      this._dispatchComplete.bind(this)
    );
  }

  /**
   * Basic fetch request. Takes in simple object ({}) and convert it to a Request Object.
   * `ajax:before` event request data can be found with `event.detail.request`
   * @fires ajax:before
   * @param {object} request - The same as a new Request params, the only difference
   *   is the url is baked into the object instead of being 2 params and dispatchEvents can be specified
   * @param {boolean} request.dispatchEvents - Whether or not to go through the event lifecycle.
   * @example
   *   Ajax.fetch({
   *     url: "/myurl",
   *     headers: {
   *       // ...
   *     },
   *     redirect: "follow",
   *   })
   * Appropriate headers will be set for you but can be overriden.
   * @return {Promise<Response>|null} Returns a Response object if dispatchEvents is false. Otherwise, null.
   */
  fetch(request) {
    if (!request.url) {
      throw new Error(
        `Fetch called without a url. Aborting.\nObj given: ${request}`
      );
    }

    // non-standard request keys.
    const { dispatchEvents, url } = request;
    delete request.url;
    delete request.dispatchEvents;

    const requestObj = new Request(url, Object.assign(this.headers, request));

    // If a user sets `request.dispatchEvents = true`, go through
    // The full event lifecycle. This is generally used by remote forms.
    if (dispatchEvents === true) {
      this._dispatch(AJAX_EVENTS.ajaxBefore, {
        detail: { request: requestObj, submitter: this._submitter },
      });

      return null;
    }

    return window.fetch(requestObj);
  }

  /**
   * @private
   * Triggers an ajax request from a form submit.
   * @return void
   */
  _ajaxSubmit(event) {
    // If it doesnt have remote="true"...forget about it!
    if (event.target.dataset.remote !== 'true') {
      return;
    }

    // Prevent default submit behavior
    event.preventDefault();

    this.element = event.target;
    this._submitter = findSubmitter(event);

    this.fetch(this.request);
  }

  /**
   * @private
   * Fires off a fetch request and returns the response data. Triggered by events.
   * @fires ajax:send
   * The request can be found via `event.detail.request`
   * @return void
   */
  _sendFetchRequest(event) {
    if (event.defaultPrevented) {
      return;
    }

    // this._disableSubmitter();

    const { request } = event.detail;

    if (!request.url) {
      throw new Error(`Fetch attempted without a url. Aborting. \n
                       Request attempted: ${request}`);
    }

    this._dispatch(AJAX_EVENTS.ajaxSend, {
      detail: { request, submitter: this._submitter },
    });

    window
      .fetch(event.detail.request)
      .then(response => this._dispatchResponse(response))
      .catch(error => this._dispatchError(error));
  }

  /**
   * Handles a JSON based response
   *   Fires `ajax:response:error` or `ajax:success` depending on the response.
   *   You can find the response in `event.detail.response`
   * @return {Response}
   */
  _dispatchResponse(response) {
    // What to do on response error
    if (response.ok) {
      return this._dispatch(AJAX_EVENTS.ajaxSuccess, {
        detail: { response, submitter: this._submitter },
      });
    }

    return this._dispatch(AJAX_EVENTS.ajaxResponseError, {
      detail: { response, submitter: this._submitter },
    });
  }

  /**
   * Handles a fetch error and fire an `ajax:error`. The error can be found in:
   * `event.detail.error` and will also issue a `console.error`
   * @return void
   */
  _dispatchError(error) {
    this._dispatch(AJAX_EVENTS.ajaxError, {
      detail: { error, submitter: this._submitter },
    });

    /* eslint-disable */
    console.error(
      `The following error was encountered during your fetch request: ${error}`
    );
    /* eslint-enable */
  }

  /*
   * @private
   * Dispatches the `ajax:complete` event. No details here!
   * @return void
   */
  _dispatchComplete(event) {
    if (event.defaultPrevented) {
      return;
    }

    this._dispatch(AJAX_EVENTS.ajaxComplete, {
      detail: { submitter: this._submitter },
    });
  }

  /**
   * @private
   * dispatches a given event in the context of `this.element`
   * @param {string} event - Event to dispatch
   * @param {options} options for the custom event
   */
  _dispatch(event, options = {}) {
    const optionsWithDefaults = Object.assign(EVENT_DEFAULTS, options);
    dispatch.call(this.element, event, optionsWithDefaults);
  }

  /**
   * Headers to send to the request object
   * @return {Header}
   */
  get headers() {
    let { response } = this.element.dataset;

    let acceptHeader;

    // if null, just use any
    if (!response) {
      acceptHeader = Ajax.acceptHeaders.any;
    } else {
      response = response.trim();

      // Use predefined first, if not predefined, fall back to the users string
      if (this.acceptHeaders[response]) {
        acceptHeader = Ajax.acceptHeaders[response];
      } else {
        acceptHeader = response;
      }
    }

    return new Headers({
      Accept: acceptHeader,
      'X-CSRF-Token': this.csrfToken,
    });
  }

  /**
   * A request object to be passed to fetch
   * @return {Request}
   */
  get request() {
    const requestOptions = {
      method: this.method,
      headers: { ...this.headers },
      redirect: 'follow',
      dispatchEvents: true,
    };

    const disallowedBodyRequests = ['get', 'head'];

    if (!disallowedBodyRequests.includes(this.method.toLowerCase())) {
      requestOptions.body = JSON.stringify(this.formData);
    }

    return { url: this.url, ...requestOptions };
  }

  /**
   * Serializes the formdata in of the form
   * @return {FormData}
   */
  get formData() {
    return new FormData(this.element);
  }

  /**
   * Finds where to send the fetch request to
   * @return {string}
   */
  get method() {
    const { method } = this.element;

    if (!method) {
      throw new Error(
        `${this.element} does not have a method attribute set. Aborting...`
      );
    }

    this._method = method;
    return this._method;
  }

  /**
   * URL to send to. Is pulled from action=""
   * Throws an error of action="" is not defined on an element.
   * @throws {Error}
   * @return {string}
   */
  get url() {
    const url = this.element.action;

    if (!url) {
      throw new Error(
        `${this.element} does not have a action attribute set. Aborting...`
      );
    }

    this._url = url;
    return this._url;
  }

  get csrfToken() {
    this._csrfToken = new Csrf().token;
    return this._csrfToken;
  }
}
