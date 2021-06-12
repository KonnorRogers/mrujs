import { assert } from '@esm-bundle/chai'
import sinon from 'sinon'

import { doNothing, assertFired, findByTestId } from '../helpers'
import { ALWAYS_SENT_EVENTS } from './ajaxHelpers'
import mrujs from '../../../src/index'

describe('Ajax', (): void => {
  afterEach((): void => {
    sinon.restore()
  })

  describe('Remote Disabled Forms', (): void => {
    it('Should not trigger any events', (): void => {
      const events = ALWAYS_SENT_EVENTS

      const stub = sinon.stub(window, 'fetch')

      window.mrujs = mrujs.start()

      events.forEach(event => {
        assertFired(event, doNothing)
      })

      assert(stub.notCalled)
    })
  })

  describe('GET 200 Request', (): void => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:send']
    const submitButton = findByTestId('GET-200')?.querySelector("input[type='submit']") as HTMLInputElement | null

    const submitGet200 = (): void => {
      const submitButton = findByTestId('GET-200')?.querySelector("input[type='text']") as HTMLInputElement | null

      submitButton?.click()
    }

    events.forEach(event => {
      it(`Should fire an ${event} 200 GET requests`, (): void => {
        assertFired(event, submitGet200)
      })
    })

    it('Should disable the button on ajax request', (): void => {
      const submitDisabled = (): void => assert.equal(submitButton?.disabled, true)

      document.addEventListener('submit', submitDisabled)
      document.addEventListener('ajax:send', submitDisabled)
      submitGet200()
      document.removeEventListener('submit', submitDisabled)
      document.removeEventListener('ajax:send', submitDisabled)
    })

    // it('Should reenable a button on ajax:complete', (): void => {
    //   // const submitEnabled = (): void => assert.equal(submitButton?.disabled, false)

    //   window.mrujs = mrujs.start()
    //   // document.addEventListener('ajax:complete', submitEnabled)
    //   submitGet200()
    //   // document.removeEventListener('ajax:complete', submitEnabled)
    // })
  })

  describe('GET 404 Request', (): void => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:response:error', 'ajax:error']

    const submitGet404 = (): void => {
      window.mrujs = mrujs.start()
      const inputEl = findByTestId('GET-404')?.querySelector("input[type='text']") as HTMLInputElement | null
      if (inputEl != null) {
        inputEl.value = '1234'
      }
      (findByTestId('GET-404')?.querySelector("input[type='submit']") as HTMLInputElement | null)?.click()
    }

    events.forEach(event => {
      it(`Should fire an ${event} for 404 GET requests`, () => {
        assertFired(event, submitGet404)
      })
    })
  })

  // This doesnt work due to some issue with chromium / webkit and hijacking link clicks...
  // describe('Ajax data-method links', () => {
  //   const events = [...ALWAYS_SENT_EVENTS, 'ajax:response:error', 'ajax:error']

  //   const getLink = (): void => {
  //     window.mrujs = mrujs.start();
  //     (findByTestId('get-link') as HTMLAnchorElement).click()
  //   }

  //   events.forEach((event) => {
  //     it(`Should fire an ${event} for link GET requests`, () => {
  //       assertFired(event, getLink)
  //     })
  //   })
  // })
})
