import { assert } from '@esm-bundle/chai';
import sinon from 'sinon';

import { doNothing, assertFired, findByTestId } from '../helpers.js';
import { ALWAYS_SENT_EVENTS } from "./ajaxHelpers.js"
import mrujs from '../../src/index.js';

describe('Ajax Fetch', () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should call native window.fetch", () => {
    sinon.replace(window, 'fetch', sinon.fake());
    mrujs.start();
    window.mrujs.fetch({url: "/test", dispatchEvents: false})
    assert(window.fetch.calledOnce)
  })

  it("Should dispatch a fetch events and go through the full lifecycle", () => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:send'];

    mrujs.start();

    window.mrujs.fetch({url: "/test"})
    events.forEach(event => {
      assertFired(event, doNothing);
    });
  })
});
