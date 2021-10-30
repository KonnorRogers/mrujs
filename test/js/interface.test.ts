import { assert } from '@open-wc/testing'

import mrujs from '../../src/index'
import * as allExports from '../../src/index'
import { railsUjs } from './fixtures/railsUjs.fixture'

describe('Should mimic the same interface as @rails/ujs', () => {
  it('Should contain all non-deprecated keys from rails-ujs', () => {
    railsUjs.forEach((key) => {
      if (!Object.keys(mrujs).includes(key)) {
        console.log('MISSING: ', key)
      }

      assert(Object.keys(mrujs).includes(key))
    })
  })

  it('should export the same object', () => {
    railsUjs.forEach((key) => {
      if (!Object.keys(allExports).includes(key)) {
        console.log('MISSING: ', key)
      }

      assert(Object.keys(mrujs).includes(key))
    })
  })
})
