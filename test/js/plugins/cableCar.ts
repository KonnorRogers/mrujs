import { assert } from '@esm-bundle/chai'

import CableReady from 'cable_ready'

import mrujs from '../../../src'
import { CableCar } from '../../../src/plugins'

const cableCar = new CableCar(CableReady)

describe('CableCar with standard config', () => {
  it('Should add CableCar to the list of plugins', () => {
    mrujs.start({ plugins: [cableCar] })
    assert(window.mrujs.plugins.find((plugin) => plugin.name === 'CableCar'))
    window.mrujs.stop()
  })

  it('Should return true for the given content type', () => {
    assert(cableCar.isCableReadyResponse("application/vnd.cable-ready.json; charset='utf-8'"))
  })

  it('Should return true for the given content type', () => {
    assert.isNotTrue(cableCar.isCableReadyResponse("app/vnd.cable-ready.json; charset='utf-8'"))
  })
})
