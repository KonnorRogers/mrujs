import { assert } from '@esm-bundle/chai';

export function findByTestId(str) {
  return document.querySelector(`[data-testid="${str}"]`);
}

export function findAllByTestId(str) {
  return document.querySelectorAll(`[data-testid="${str}"]`);
}

export function doNothing() {}

/**
 * @private
 * checks if an event was fired. Used as a callback for testEvent.
 */
function eventFired(event) {
  assert.equal(event.type, window.event);
}

// Tests that an event was sent to the browser
export function assertFired(eventName, callback) {
  // Allows us a global spot to find the event name from the event callback
  window.event = eventName;
  document.addEventListener(eventName, eventFired);
  callback();
  document.removeEventListener(eventName, eventFired);
}
