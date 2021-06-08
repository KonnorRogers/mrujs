import { assert } from '@esm-bundle/chai'
import sinon from 'sinon'

import mrujs from '../../../src/index'

describe('Ajax Fetch', (): void => {
  afterEach((): void => {
    sinon.restore()
  })

  it('Should call native window.fetch', async (): Promise<void> => {
    const stub = sinon.stub(window, 'fetch')

    await mrujs.fetch('/test')
    assert(stub.calledOnce)
  })
})
