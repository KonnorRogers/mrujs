import { assert } from '@esm-bundle/chai'
import mrujs, { Mrujs } from '../../src/index'

describe('index', () => {
  it('Should set a top level mrujs on the window', () => {
    mrujs.start()
    assert(window.mrujs instanceof Mrujs)
  })

  it('Should retrieve the proper csrf token', () => {
    mrujs.start()
    assert.equal(window.mrujs.csrfToken, '1234')
  })

  it('Should allow for custom querySelectors', () => {
    const qs = mrujs.querySelectors
    qs.linkClickSelector.selector += ', my-custom-element'
    mrujs.querySelectors = qs

    mrujs.start()
    assert.include(mrujs.querySelectors.linkClickSelector.selector, 'my-custom-element')
  })
})
