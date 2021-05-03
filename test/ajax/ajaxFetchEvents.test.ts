import { assert } from '@esm-bundle/chai'
import sinon from 'sinon'

import { doNothing, assertFired } from '../helpers'
import { ALWAYS_SENT_EVENTS } from './ajaxHelpers'
import mrujs from '../../src/index'

describe('Ajax Fetch', (): void => {
  afterEach((): void => {
    sinon.restore()
  })

  it('Should call native window.fetch', async (): Promise<void> => {
    const stub = sinon.stub(window, 'fetch')

    await mrujs.fetch({ url: '/test' })
    assert(stub.calledOnce)
  })

  it('Should dispatch a fetch events and go through the full lifecycle', (): void => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:send']

    mrujs.fetch({ url: '/test', dispatchEvents: true }) as null
    events.forEach(event => {
      assertFired(event, doNothing)
    })
  })
})
