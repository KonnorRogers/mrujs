import { assert } from '@esm-bundle/chai'
import CableReady from 'cable_ready'
import mrujs from '../../../src'
import { CableCar } from '../../../plugins'

describe('CableCar with custom config', () => {
  it('should allow custom mimetypes', () => {
    const mimeType = 'my-mime'
    const cableCar = new CableCar(CableReady, { mimeType })

    mrujs.start({
      plugins: [cableCar]
    })

    const link = document.querySelector('#cable-car-link') as HTMLElement

    assert.equal(link.dataset.type, mimeType)
    assert.equal(link.dataset.remote, 'true')

    mrujs.stop()
  })
})
