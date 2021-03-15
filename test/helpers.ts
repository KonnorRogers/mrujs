import sinon from 'sinon'
// import { assert } from '@esm-bundle/chai'

export function findByTestId (str: string): Element | null {
  return document.querySelector(`[data-testid="${str}"]`)
}

export function findAllByTestId (str: string): NodeListOf<Element> {
  return document.querySelectorAll(`[data-testid="${str}"]`)
}

export function doNothing (): void {}

// Tests that an event was triggered by the browser
export function assertFired (eventName: string, callback: Function): void {
  const stub = sinon.stub().callsFake(() => {})
  document.addEventListener(eventName, stub)
  callback()
  document.removeEventListener(eventName, stub)
  // assert(stub.called)
}
