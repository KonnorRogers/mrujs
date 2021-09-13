import Rails from 'mrujs'
import { JsErb, AsyncConfirm } from "mrujs/plugins"

(async () => {
  if (window.useTurbo === true) {
    const Turbo = await import('@hotwired/turbo')
    window.Turbo = Turbo
  } else {
    const turbolinks = await import('turbolinks')
    turbolinks.default.start()
  }
})()

Rails.start({
  plugins: [
    AsyncConfirm(),
    JsErb()
  ]
})
