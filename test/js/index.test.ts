import { assert } from '@esm-bundle/chai'
import mrujs, { Mrujs } from '../../src/index'
import { BASE_ACCEPT_HEADERS } from '../../src/utils/headers'

describe('index', () => {
  it('Should set a top level mrujs on the window', () => {
    mrujs.start()
    assert(window.mrujs instanceof Mrujs)
    mrujs.stop()
  })

  it('Should retrieve the proper csrf token', () => {
    mrujs.start()
    assert.equal(window.mrujs.csrfToken, '1234')
    mrujs.stop()
  })

  it('Should allow for custom querySelectors', () => {
    const qs = mrujs.querySelectors
    qs.linkClickSelector.selector += ', my-custom-element'
    mrujs.querySelectors = qs

    mrujs.start()
    assert.include(mrujs.querySelectors.linkClickSelector.selector, 'my-custom-element')
    mrujs.stop()
  })

  it('Should allow for custom mimetypes', () => {
    const customMime = { shortcut: 'my-custom-mime', header: 'text/vnd.custom' }
    mrujs.registerMimeTypes([customMime])
    mrujs.start()

    assert(mrujs.mimeTypes[customMime.shortcut] === customMime.header)

    // Make sure we dont override existing headers
    for (const [key, value] of Object.entries(BASE_ACCEPT_HEADERS)) {
      assert(mrujs.mimeTypes[key] === value)
    }

    mrujs.stop()
  })
})
