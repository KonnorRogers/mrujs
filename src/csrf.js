// https://github.com/rails/rails/blob/main/actionview/app/assets/javascripts/rails-ujs/utils/csrf.coffee

export default class Csrf {
  connect() {
    // install the observer, then refresh.
    this.observer.observe(document, this.observerOptions);
    this.refresh();
  }

  disconnect() {
    this.observer.disconnect();
  }

  // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
  refresh() {
    if (this.token && this.param) {
      document
        .querySelectorAll(`form input[name="${this.param}"]`)
        .forEach(input => {
          const inputEl = input;
          inputEl.value = this.token;
        });
    }
  }

  observerCallback(mutations) {
    for (const mutation of mutations) {
      // If a new csrf-token is added, lets update the token and refresh all form elements.
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (Csrf.isCsrfToken(node)) {
            this.refresh();
          }
        }
      } else if (mutation.type === 'attributes') {
        // For when the `meta[name='csrf-token'].content` changes
        const node = mutation.target;
        if (Csrf.isCsrfToken(node)) {
          this.refresh();
        }
      }
    }
  }

  static isCsrfToken(node) {
    if (node instanceof HTMLMetaElement) {
      return node.matches('meta[name="csrf-token]"');
    }

    return false;
  }

  get observer() {
    if (this._observer) {
      return this._observer;
    }

    this._observer = new MutationObserver(this.observerCallback);
    return this._observer;
  }

  get observerOptions() {
    if (this._observerOptions) {
      return this._observerOptions;
    }

    this._observerOptions = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['content'],
      attributeOldValue: false,
    };

    return this._observerOptions;
  }

  // Up-to-date Cross-Site Request Forgery token
  get token() {
    this._token = document.querySelector('meta[name="csrf-token"]');

    if (this._token) {
      return this._token.content;
    }

    return null;
  }

  // URL param that must contain the CSRF token
  get param() {
    this._param = document.querySelector('meta[name="csrf-param"]');

    if (this._param) {
      return this._param.content;
    }

    return null;
  }
}
