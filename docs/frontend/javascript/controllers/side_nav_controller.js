import { Controller } from "stimulus"

export default class extends Controller {
  open() {
    this.drawer.show()
  }

  close() {
    this.drawer.hide()
  }

  toggle() {
    if (this.drawer.open) {
      this.open()
    } else {
      this.close()
    }
  }

  get drawer() {
    return document.querySelector("#side-nav-drawer")
  }
}

