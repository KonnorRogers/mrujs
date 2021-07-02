import { assert } from '@esm-bundle/chai'
import { spy } from 'sinon'

import CableReady from 'cable_ready'

import mrujs, { CableCar } from '../../../src'

describe('CableCar', () => {
  beforeEach(() => {
    mrujs.start({
      plugins: [
        new CableCar(CableReady)
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
    assert.equal(link.dataset.type, 'json')
    assert.equal(link.dataset.remote, 'true')
  })

  it('Should fire on ajax:complete', () => {
    const cableReadySpy = spy(CableReady, 'perform')
    const link = document.querySelector('#cable-car-link') as HTMLElement

    link.click()

    const called = (): void => assert(cableReadySpy.calledOnce)

    document.addEventListener('ajax:complete', called)
  })
})
