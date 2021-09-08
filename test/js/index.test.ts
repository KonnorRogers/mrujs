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
    assert.equal(window.mrujs.csrfToken, '1234')
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

  it('should probably append a querySelector', () => {
    mrujs.start()

    let name = 'linkClickSelector'
    let selector = 'blah'
    mrujs.appendToQuerySelector(name, { selector })
    assert(mrujs.querySelectors[name].selector.endsWith(selector))

    let exclude = 'lolololol'
    name = 'buttonClickSelector'
    mrujs.appendToQuerySelector('buttonClickSelector', { exclude })
    assert(mrujs.querySelectors[name].exclude.endsWith(exclude))

    selector = 'ohmylord'
    exclude = 'trololol'
    name = 'inputChangeSelector'
    mrujs.appendToQuerySelector(name, { selector, exclude })
    assert(mrujs.querySelectors[name].selector.endsWith(selector))
    assert(mrujs.querySelectors[name].exclude.endsWith(exclude))
    mrujs.stop()
  })

  it('Should register a new callback on confirms', (): void => {
    mrujs.start()
    function myCallback (): void {}
    mrujs.registerConfirm('lol', myCallback)
    assert(mrujs.confirmClass.callbacks.includes(myCallback))
    mrujs.stop()
  })
})
