import Rails from 'mrujs'
import { JsErb } from "mrujs/plugins"

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
    JsErb()
  ]
})
