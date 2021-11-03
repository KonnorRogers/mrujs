import { html, fixture, assert } from '@open-wc/testing'
import sinon from 'sinon'

import mrujs from '../../../src/'
import { FormSubmission } from '../../../src/formSubmission'

const getForm = html`
  <form
    data-testid="GET-200"
    method="get"
    action="/demo/index.html"
    data-remote="true"
  >
    <input type="hidden" name="authenticity_token" value=1234>
    <label for="user[name]">GET 200</label>
    <input type="text" name="user[name]" value="blah" />
    <input type="submit" value="Submit" />
  </form>
`

const postForm = html`
  <form
    data-testid="POST-200"
    method="POST"
    action="/demo/index.html"
    data-remote="true"
  >
    <input type="hidden" name="authenticity_token" value=1234>
    <label for="user[name]">POST 200</label>
    <input type="text" name="user[name]" value="konnor" />
    <input type="submit" value="Submit" />
  </form>
`

describe('Ajax Fetch', (): void => {
  afterEach((): void => {
    sinon.restore()
  })

  it('Should call native window.fetch', async (): Promise<void> => {
    const stub = sinon.stub(window, 'fetch')

    await mrujs.fetch('/test')
    assert(stub.calledOnce)
  })

  it('Should be able to consume body only once', async (): Promise<void> => {
    const response = mrujs.FetchResponse(await mrujs.fetch('/') as Response)
    await response.html()
  })

  it('Should append get params to url and have an empty body', async (): Promise<void> => {
    const el = await fixture(getForm)
    mrujs.start()
    const submitButton = el.querySelector("input[type='submit']") as HTMLInputElement
    const submission = FormSubmission(el, submitButton)
    assert(submission.request.method === 'GET')
    const searchParams = new URLSearchParams(new URL(submission.request.url).search)
    assert(searchParams.get('user[name]') === 'blah')
    mrujs.stop()
  })

  it('Should append params to the body', async (): Promise<void> => {
    const el = await fixture(postForm)
    mrujs.start({})
    const submitButton = el.querySelector("input[type='submit']") as HTMLInputElement
    const submission = FormSubmission(el, submitButton)
    assert((submission.fetchRequest.body as URLSearchParams).get('user[name]') === 'konnor')
    assert(submission.request.method === 'POST')
    mrujs.stop()
  })
})
