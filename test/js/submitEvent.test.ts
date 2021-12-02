import { assert, fixture } from '@open-wc/testing'
import mrujs from '../../src'

describe('SubmitEvent', () => {
  // https://github.com/ParamagicDev/mrujs/issues/171
  it('Should allow users to send a submit event with no detail object', async () => {
    mrujs.start()
    const element = await fixture('<a href="/blah"></a>')
    assert.doesNotThrow(
      () => element.dispatchEvent(new CustomEvent('submit', { cancelable: true, bubbles: true }))
    )
    mrujs.stop()
  })
})
