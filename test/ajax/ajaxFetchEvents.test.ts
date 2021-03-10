import { assert } from '@esm-bundle/chai'
import sinon from 'sinon'

import { doNothing, assertFired } from '../helpers'
import { ALWAYS_SENT_EVENTS } from './ajaxHelpers'
import { Mrujs } from '../../src/index'

describe('Ajax Fetch', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('Should call native window.fetch', () => {
    const stub = sinon.stub(window, 'fetch')

    const mrujs = new Mrujs()
    mrujs.fetch({ url: '/test' })
    assert(stub.calledOnce)
  })

  it('Should dispatch a fetch events and go through the full lifecycle', () => {
    const events = [...ALWAYS_SENT_EVENTS, 'ajax:send']

    const mrujs = new Mrujs().start()

    mrujs.fetch({ url: '/test', dispatchEvents: true })
    events.forEach(event => {
      assertFired(event, doNothing)
    })
  })
})
