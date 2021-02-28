import { assert } from '@esm-bundle/chai';
import sinon from 'sinon';

import { doNothing, assertFired, findByTestId } from '../helpers.js';
import { ALWAYS_SENT_EVENTS } from "./ajaxHelpers.js"
import mrujs from '../../src/index.js';

describe('Ajax', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Remote Disabled Forms', () => {
    it('Should not trigger any events', () => {
      const events = ALWAYS_SENT_EVENTS;

      sinon.replace(window, 'fetch', sinon.fake());

      mrujs.start();

      events.forEach(event => {
        assertFired(event, doNothing);
      });

      assert(window.fetch.notCalled);
    });
  });

  describe('GET 200 Request', () => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:send'];
    const submitButton = findByTestId('GET-200').querySelector("input[type='submit']");

    const submitGet200 = () => {
      mrujs.start()
      findByTestId('GET-200').querySelector("input[type='text']").value =
        '1234';
      submitButton.click()
    };

    events.forEach(event => {
      it(`Should fire an ${event} 200 GET requests`, () => {
        assertFired(event, submitGet200);
      });
    });

    it("Should disable the button on ajax request", () => {
      const submitDisabled = () => assert.equal(submitButton.disabled, true)

      document.addEventListener("submit", submitDisabled)
      document.addEventListener("ajax:send", submitDisabled)
      submitGet200()
      document.removeEventListener("submit", submitDisabled)
      document.removeEventListener("ajax:send", submitDisabled)
    })

    it ("Should reenable a button on ajax:complete", () => {
      const submitEnabled = () => assert.equal(submitButton.enabled, true)

      document.addEventListener("ajax:complete", submitEnabled)
      submitGet200()
      document.removeEventListener("ajax:complete", submitEnabled)
    })
  });

  describe('GET 404 Request', () => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:response:error'];

    const submitGet404 = () => {
      mrujs.start()
      findByTestId('GET-404').querySelector("input[type='text']").value = '1234';
      findByTestId('GET-404').querySelector("input[type='submit']").click();
    };

    events.forEach(event => {
      it(`Should fire an ${event} for 404 GET requests`, () => {
        assertFired(event, submitGet404);
      });
    });
  });
});
