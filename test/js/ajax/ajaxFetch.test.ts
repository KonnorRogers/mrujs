import { assert } from '@esm-bundle/chai'
import sinon from 'sinon'

import mrujs, { FetchResponse } from '../../../src/index'

describe('Ajax Fetch', (): void => {
  afterEach((): void => {
    sinon.restore()
  })

  it('Should call native window.fetch', async (): Promise<void> => {
    const stub = sinon.stub(window, 'fetch')

    await mrujs.fetch('/test')
    assert(stub.calledOnce)
  })

  it('Should be able to consume body twice', async (): Promise<void> => {
    const response = new FetchResponse(await mrujs.fetch('/'))
    await response.responseHtml
    await response.responseHtml
  })
})
