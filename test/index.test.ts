import { assert } from '@esm-bundle/chai'
import { Mrujs } from '../src/index'

describe('index', () => {
  it('Should set a top level mrujs on the window', () => {
    window.mrujs = new Mrujs().start()
    assert(window.mrujs instanceof Mrujs)
  })

  it('Should retrieve the proper csrf token', () => {
    window.mrujs = new Mrujs().start()
    assert.equal(window.mrujs.csrfToken, '1234')
  })
})
