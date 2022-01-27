import { assert } from '@esm-bundle/chai'
import CableReady from 'cable_ready'
import mrujs from '../../../src'
import { CableCar } from '../../../plugins/src/'

describe('CableCar with custom config', () => {
  it('should allow custom mimetypes', () => {
    const mimeType = 'my-mime'
    const cableCar = new CableCar(CableReady, { mimeType })

    mrujs.start({
      plugins: [cableCar]
    })

    assert(window.mrujs.mimeTypes.any.includes(mimeType))
    assert(window.mrujs.mimeTypes.any.includes('*/*'))

    mrujs.stop()
  })
})
