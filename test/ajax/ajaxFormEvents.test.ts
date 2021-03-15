import { assert } from '@esm-bundle/chai'
import sinon from 'sinon'

import { doNothing, assertFired, findByTestId } from '../helpers'
import { ALWAYS_SENT_EVENTS } from './ajaxHelpers'
import { Mrujs } from '../../src/index'

describe('Ajax', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('Remote Disabled Forms', () => {
    it('Should not trigger any events', () => {
      const events = ALWAYS_SENT_EVENTS

      const stub = sinon.stub(window, 'fetch')

      window.mrujs = new Mrujs().start()

      events.forEach(event => {
        assertFired(event, doNothing)
      })

      assert(stub.notCalled)
    })
  })

  describe('GET 200 Request', () => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:send']
    const submitButton = findByTestId('GET-200')?.querySelector("input[type='submit']") as HTMLInputElement | null

    const submitGet200 = () => {
      window.mrujs = new Mrujs().start()

      const submitButton = findByTestId('GET-200')?.querySelector("input[type='text']") as HTMLInputElement | null

      submitButton?.click()
    }

    events.forEach(event => {
      it(`Should fire an ${event} 200 GET requests`, () => {
        assertFired(event, submitGet200)
      })
    })

    it('Should disable the button on ajax request', () => {
      const submitDisabled = () => assert.equal(submitButton?.disabled, true)

      document.addEventListener('submit', submitDisabled)
      document.addEventListener('ajax:send', submitDisabled)
      submitGet200()
      document.removeEventListener('submit', submitDisabled)
      document.removeEventListener('ajax:send', submitDisabled)
    })

    it('Should reenable a button on ajax:complete', () => {
      const submitEnabled = () => assert.equal(submitButton?.disabled, false)

      document.addEventListener('ajax:complete', submitEnabled)
      submitGet200()
      document.removeEventListener('ajax:complete', submitEnabled)
    })
  })

  describe('GET 404 Request', () => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:response:error']

    const submitGet404 = () => {
      window.mrujs = new Mrujs().start()
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
})
