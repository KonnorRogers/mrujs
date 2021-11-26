import { assert } from '@open-wc/testing'

import mrujs from '../../src'
import { FetchRequest } from '../../src/http/fetchRequest'

describe('FetchRequest', () => {
  const csrfToken = '1234'

  beforeEach(() => {
    const csrfParam = document.createElement('meta')
    csrfParam.name = 'csrf-param'
    csrfParam.content = 'authenticity_token'

    const csrfTag = document.createElement('meta')
    csrfTag.name = 'csrf-token'
    csrfTag.content = csrfToken

    document.head.appendChild(csrfParam)
    document.head.appendChild(csrfTag)
  })

  it('Should attach CSRF token to headers for non-GET requests', () => {
    mrujs.start()
    const request = FetchRequest('/', { method: 'post' })
    assert.equal(request.headers.get('X-CSRF-TOKEN'), csrfToken)
    mrujs.stop()
  })

  it('Should not attach CSRF toekns to headers for GET requests', () => {
    mrujs.start()
    const request = FetchRequest('/', { method: 'get' })
    assert.equal(request.headers.get('X-CSRF-TOKEN'), null)
    mrujs.stop()
  })
})
