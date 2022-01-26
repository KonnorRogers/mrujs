// Shamelessly stolen from Turbo. Makes the submit event listenable from Safari.
// https://github.com/hotwired/turbo/blob/main/src/polyfills/submit-event.ts

type FormSubmitter = HTMLElement & { form?: HTMLFormElement, type?: string }

const submittersByForm: WeakMap<HTMLFormElement, HTMLElement> = new WeakMap()

function findSubmitterFromClickTarget (target: EventTarget | null): FormSubmitter | null {
  const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null
  const candidate = (element != null) ? element.closest('input, button') as FormSubmitter : null

  if ((candidate != null) && candidate.type === 'submit') {
    return candidate
  }

  return null
}

function clickCaptured (event: Event): void {
  const submitter = findSubmitterFromClickTarget(event.target)

  if (submitter?.form != null) {
    submittersByForm.set(submitter.form, submitter)
  }
}

(function () {
  let prototype = Event.prototype

  // Safari 15 has a bug with submitters, this is a check for that.
  const isSafari = navigator.vendor.includes('Apple Computer')

  if ('SubmitEvent' in window) {
    // No need to continue, polyfill not needed. Safari 15 has a bug with submitters.
    if (!isSafari) return

    // We have to attach to the SubmitEvent prototype in Safari instead of Event prototype.
    prototype = window.SubmitEvent.prototype
  }

  // Polyfill has already been run, do not pass go.
  if ('submitter' in prototype) return

  addEventListener('click', clickCaptured, true)

  Object.defineProperty(prototype, 'submitter', {
    get (): HTMLElement | undefined {
      if (this.type === 'submit' && this.target instanceof HTMLFormElement) {
        return submittersByForm.get(this.target)
      }

      return undefined
    }
  })
})()

// Ensure TypeScript parses this file as module
export {}

