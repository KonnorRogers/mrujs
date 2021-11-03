import '../mrujs'

export type ElementSelector = string | HTMLElement | Document

export function findElements<T> (root: ElementSelector, selector: string): T[] {
  if (typeof root === 'string') {
    selector = root
    root = document
  }
  const elements = root.querySelectorAll(selector)
  return window.mrujs.toArray(elements)
}

export function findElement (root: ElementSelector, selector: string): Element | null {
  if (typeof root === 'string') {
    selector = root
    root = document.documentElement
  }
  return root.querySelector(selector)
}

export function dispatchEvent (element: HTMLInputElement | HTMLFormElement, name: string, eventInit: CustomEventInit = {}): CustomEvent {
  // TODO: add a `isDisabled` function to mrujs.
  const { disabled } = element

  let event: CustomEvent

  try {
    window.mrujs.disableElement(element)
    event = window.mrujs.dispatch.call(element, name, eventInit)
  } finally {
    if (disabled === true) {
      window.mrujs.disableElement(element)
    } else {
      window.mrujs.enableElement(element)
    }
  }

  return event
}

export function toArray<T> (value: any): T[] {
  return window.mrujs.toArray(value)
}
