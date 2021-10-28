import { html, fixture, assert } from '@open-wc/testing'

import { MethodSubmission } from '../../src/methodSubmission'

describe('MethodSubmission', () => {
  it('Should append its name / value to the formData object', async () => {
    const el: HTMLElement = await fixture(html`
      <button name="blah" value="duh" data-method="post" data-remote="true" data-url="https://blah.com">
      </button>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal('duh', body.get('blah'))
  })

  it('Should append Select name / value to the formData object', async () => {
    const el: HTMLElement = await fixture(html`
      <select name="blah" data-method="post" data-remote="true" data-url="https://blah.com">
        <option value="haha" selected>Ha</option>
        <option value="nono">No</option>
        <option value="yaya">Yay</option>
      </select>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal('haha', body.get('blah'))
  })

  it('Should not append name / value to the formData object when no name', async () => {
    const el: HTMLElement = await fixture(html`
      <button value="duh" data-method="post" data-remote="true" data-url="https://blah.com">
      </button>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal(0, Array.from(body.keys()).length)
  })

  it('Should append name / value to the formData object when empty string value', async () => {
    const el: HTMLElement = await fixture(html`
      <button name="haha" data-method="post" data-remote="true" data-url="https://blah.com">
      </button>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal('', body.get('haha'))
  })

  it('Should should account for extra JSON params', async () => {
    const el: HTMLElement = await fixture(html`
      <button name="blah" value="duh" data-method="post" data-remote="true" data-url="https://blah.com" data-params='{"myKey": "myValue", "myKey2": "myValue2"}'>
      </button>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal('duh', body.get('blah'))
    assert.equal('myValue', body.get('myKey'))
    assert.equal('myValue2', body.get('myKey2'))
  })

  it('Should account for extra unescaped params', async () => {
    const el: HTMLElement = await fixture(html`
      <button name="blah" value="duh" data-method="post" data-remote="true" data-url="https://blah.com" data-params='myKey=myValue'>
      </button>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal('duh', body.get('blah'))
    assert.equal('myValue', body.get('myKey'))
  })

  it('Should account for extra multiple params', async () => {
    const el: HTMLElement = await fixture(html`
      <button name="blah" value="duh" data-method="post" data-remote="true" data-url="https://blah.com" data-params='myKey=myValue&myKey2=myValue2'>
      </button>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal('duh', body.get('blah'))
    assert.equal('myValue', body.get('myKey'))
    assert.equal('myValue2', body.get('myKey2'))
  })

  it('Should account for escaped values', async () => {
    const valueToBeEscaped = 'шеллы'
    const el: HTMLElement = await fixture(html`
      <button name="blah" value="duh" data-method="post" data-remote="true" data-url="https://blah.com" data-params='myKey=${encodeURIComponent(valueToBeEscaped)}&myKey2=myValue2'>
      </button>`)

    const submission = MethodSubmission(el)

    const body = submission.fetchRequest.body as URLSearchParams
    assert.equal('duh', body.get('blah'))
    assert.equal(valueToBeEscaped, body.get('myKey'))
    assert.equal('myValue2', body.get('myKey2'))
  })
})
