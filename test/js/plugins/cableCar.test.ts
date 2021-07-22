import { assert } from '@esm-bundle/chai'

import CableReady from 'cable_ready'

import mrujs, { CableCar } from '../../../src'

const cableCar = new CableCar(CableReady)

describe('CableCar with standard config', () => {
  beforeEach(() => {
    mrujs.start({
      plugins: [
        cableCar
      ]
    })
  })

  afterEach(() => {
    window.mrujs.stop()
  })

  it('Should add CableCar to the list of plugins', () => {
    assert(window.mrujs.plugins.find((plugin) => plugin.name === 'CableCar'))
  })

  it('Should automatically add data-type and data-remote to data-cable-car elements', () => {
    const link = document.querySelector('#cable-car-link') as HTMLElement
    assert.equal(link.dataset.type, 'application/vnd.cable-ready.json')
    assert.equal(link.dataset.remote, 'true')
  })
})
