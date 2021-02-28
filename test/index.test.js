import { assert } from "@esm-bundle/chai"
import Mrujs from "../src/mrujs.js"
import mrujs from "../src/index.js"

describe('index', () => {
  afterEach(() => {
    window.mrujs = undefined;
    window._mrujs_loaded = undefined;
  })

  it("Should set a top level mrujs on the window", () => {
    mrujs.start();
    assert(window.mrujs instanceof Mrujs)
  })

  it("Should set window._mrujs_loaded to true", () => {
    mrujs.start()
    assert.equal(window._mrujs_loaded, true)
    mrujs.stop()
    assert.equal(window._mrujs_loaded, false)
  })

  it("Should not hit any issues if started twice", () => {
    mrujs.start();
    mrujs.start();
    assert(window.mrujs instanceof Mrujs)
  })

  it("Should throw an error if mrujs already exists and isnt an instance of mrujs", () => {
    window.mrujs = {}
    assert.throws(mrujs.start, /already initialized/)
  })

  it("Should retrieve the proper csrf token", () => {
    mrujs.start()
    assert.equal(window.mrujs.csrfToken, "1234")
  })
});

