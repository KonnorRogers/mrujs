import { assert } from '@esm-bundle/chai'

import mrujs from '../../src/index'
import { BASE_ACCEPT_HEADERS } from '../../src/utils/headers'

describe('index', () => {
  it('Should set a top level mrujs on the window', () => {
    mrujs.start()
    assert(window.mrujs)
    mrujs.stop()
  })

  it('Should retrieve the proper csrf token', () => {
    mrujs.start()
    assert.equal(window.mrujs.csrfToken(), '1234')
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

  it('Should allow overriding internal mimetypes', () => {
    const customMime = { shortcut: 'any', header: 'text/vnd.custom' }
    mrujs.registerMimeTypes([customMime])
    mrujs.start()

    assert(mrujs.mimeTypes[customMime.shortcut] === customMime.header)
    assert(mrujs.mimeTypes.any !== BASE_ACCEPT_HEADERS.any)

    mrujs.stop()
  })
})
