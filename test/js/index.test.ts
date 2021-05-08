import { assert } from '@esm-bundle/chai'
import mrujs, { Mrujs } from '../../src/index'

describe('index', () => {
  it('Should set a top level mrujs on the window', () => {
    mrujs.start()
    assert(window.mrujs instanceof Mrujs)
  })

  it('Should retrieve the proper csrf token', () => {
    window.mrujs = mrujs.start()
    assert.equal(window.mrujs.csrfToken, '1234')
  })
})
