import { assert } from '@esm-bundle/chai'
import sinon from 'sinon'

import { doNothing, assertFired, findByTestId } from '../helpers'
import { ALWAYS_SENT_EVENTS } from './ajaxHelpers'
import mrujs from '../../../src/index'

describe('Ajax', (): void => {
  afterEach((): void => {
    sinon.restore()
    window.mrujs.stop()
  })

  describe('Remote Disabled Forms', (): void => {
    it('Should not trigger any events', (): void => {
      const events = ALWAYS_SENT_EVENTS

      const stub = sinon.stub(window, 'fetch')

      mrujs.start()

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
      submitButton?.click()
    }

    events.forEach(event => {
      it(`Should fire an ${event} 200 GET requests`, (): void => {
        mrujs.start()
        assertFired(event, submitGet200)
      })
    })
  })

  describe('GET 404 Request', (): void => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:response:error', 'ajax:error']

    const submitGet404 = (): void => {
      const inputEl = findByTestId('GET-404')?.querySelector("input[type='text']") as HTMLInputElement | null
      if (inputEl != null) {
        inputEl.value = '1234'
      }
      (findByTestId('GET-404')?.querySelector("input[type='submit']") as HTMLInputElement | null)?.click()
    }

    events.forEach(event => {
      it(`Should fire an ${event} for 404 GET requests`, () => {
        mrujs.start()
        assertFired(event, submitGet404)
      })
    })
  })

  describe('Firing ajax:stopped', () => {
    const event = 'ajax:stopped'
    const submitButton = findByTestId('GET-200')?.querySelector("input[type='text']") as HTMLInputElement | null

    const submitGet200 = (): void => {
      submitButton?.click()
    }

    it('should fire on event.preventDefault()', () => {
      mrujs.start()
      const preventDefault = (event: CustomEvent): void => event.preventDefault()
      document.addEventListener('ajax:before', preventDefault as EventListener)
      assertFired(event, submitGet200)
      assert.equal(submitButton?.dataset.ujsDisabled, undefined)
      document.removeEventListener('ajax:before', preventDefault as EventListener)
    })

    it('should fire on event.detail.fetchRequest.cancel()', () => {
      mrujs.start()
      const preventDefault = (event: CustomEvent): void => event.preventDefault()
      document.addEventListener('ajax:before', preventDefault as EventListener)
      assertFired(event, submitGet200)
      document.removeEventListener('ajax:before', preventDefault as EventListener)
    })
  })

  describe('Ajax data-method links', () => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:response:error', 'ajax:error']

    const getLink = (): void => {
      window.mrujs = mrujs.start();
      (findByTestId('get-link') as HTMLAnchorElement).click()
    }

    events.forEach((event) => {
      it(`Should fire an ${event} for link GET requests`, () => {
        assertFired(event, getLink)
      })
    })
  })

  describe('Ajax data-method links work on nested elements', () => {
    const events = ALWAYS_SENT_EVENTS

    const deleteLink = (): void => {
      window.mrujs = mrujs.start();
      (findByTestId('delete-button') as HTMLButtonElement).click()
    }

    events.forEach((event) => {
      it(`Should fire an ${event} for link DELETE requests`, () => {
        assertFired(event, deleteLink)
      })
    })
  })
})
