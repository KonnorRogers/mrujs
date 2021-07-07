import { html, render } from 'lit'
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["container"]

  show() {
    this.containerTarget.style.display = "block";
  }

  hide() {
    this.containerTarget.style.display = "none";
  }
}

