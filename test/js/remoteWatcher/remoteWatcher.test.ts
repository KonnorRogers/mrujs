import { assert } from '@esm-bundle/chai'
import mrujs from '../../../src'

async function nextEventLoopTick (): Promise<void> {
  return await new Promise<void>(resolve => setTimeout(() => resolve(), 0))
}

describe('RemoteWatcher', () => {
  it('Should auto attach to remote forms + links', async () => {
    mrujs.start()
    const remoteForm = document.createElement('form')
    remoteForm.classList.add('remote')
    remoteForm.setAttribute('data-remote', 'true')

    const remoteLink = document.createElement('a')
    remoteLink.classList.add('remote')

    const normalForm = document.createElement('form')
    normalForm.classList.add('not-remote')
    const normalLink = document.createElement('a')
    normalForm.classList.add('not-remote')

    ;[remoteForm, remoteLink, normalForm, normalLink].forEach((el) => document.body.appendChild(el))
    remoteLink.setAttribute('data-remote', 'true')

    // We need to wait for next event loop to be able to let the mutation observer fire.
    await nextEventLoopTick()

    document.querySelectorAll('.remote').forEach((el) => assert(el.getAttribute('data-turbo') === 'false'))
    document.querySelectorAll('.not-remote').forEach((el) => assert(el.getAttribute('data-turbo') == null))

    mrujs.stop()
  })
})
