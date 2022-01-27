// This is a base test for the plugin interface.
import { MrujsPluginInterface } from '../../types'
import { assert } from '@esm-bundle/chai'
import { spy } from 'sinon'

import mrujs from '../../src/index'

describe('plugins', () => {
  it('Should allow adding plugins as objects', () => {
    const consoleSpy = spy(console, 'info')

    const name = 'my-plugin'

    const plugin = {
      name,
      connect: () => { console.info(`${name} connecting`) },
      disconnect: () => { console.info(`${name} disconnecting`) }
    }

    mrujs.start({
      plugins: [
        plugin
      ]
    })

    assert(mrujs.plugins[0].name === name)

    mrujs.stop()

    assert(consoleSpy.calledWith(`${name} connecting`))
    assert(consoleSpy.calledWith(`${name} disconnecting`))

    consoleSpy.restore()
  })

  it('Should allow adding plugins as classes', () => {
    const consoleSpy = spy(console, 'info')

    const name = 'my-plugin'

    class Plugin implements MrujsPluginInterface {
      get name (): string { return name }
      connect (): void { console.info(`${this.name} connecting`) }
      disconnect (): void { console.info(`${this.name} disconnecting`) }
    }

    mrujs.start({
      plugins: [
        new Plugin()
      ]
    })

    assert(mrujs.plugins[0].name === name)

    mrujs.stop()

    assert(consoleSpy.calledWith(`${name} connecting`))
    assert(consoleSpy.calledWith(`${name} disconnecting`))

    consoleSpy.restore()
  })
})
