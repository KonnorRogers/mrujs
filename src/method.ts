import { SELECTORS } from './utils/dom'

export const ALLOWABLE_METHODS = [
  'get',
  'head',
  'post',
  'put',
  'delete',
  'patch'
]

export class Method {
  connect (): void {
    this.allLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', this.handle)
    })
  }

  disconnect (): void {
    this.allLinks.forEach((link: HTMLAnchorElement) => {
      link.removeEventListener('click', this.handle)
    })
  }

  /**
   * Handles "data-method" on <a> tags such as:
   * @example
   *   // Not implemented!
   *   <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
   *
   *   // Implemented!
   *   <a href="/users/5" data-method="delete" rel="nofollow">Delete</a>
   */
  handle (event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    const link = event.target as HTMLAnchorElement
    const method = link.getAttribute('data-method')

    if (method == null) return
    if (!ALLOWABLE_METHODS.includes(method.toLowerCase())) return

    const href = link.getAttribute('href')

    if (href == null) return

    const csrfToken = window?.mrujs?.csrfToken
    const csrfParam = window?.mrujs?.csrfParam

    const form = document.createElement('form')
    let formContent = `<input name='_method' value='${method}' type='hidden' />`

    if (csrfToken != null && csrfParam != null) {
      // Must trigger submit by click on a button, else "submit" event handler won't work!
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
      formContent += `<input type="hidden" name="${csrfParam}" value="${csrfToken}" />`
    }

    formContent += '<input type="submit" />'

    form.method = 'post'
    form.action = href
    form.target = link.target
    form.innerHTML = formContent
    form.style.display = 'none'

    document.body.appendChild(form)

    const submitBtn = form.querySelector('[type="submit"]') as HTMLInputElement
    submitBtn.click()
  }

  get allLinks (): HTMLAnchorElement[] {
    return Array.from(document.querySelectorAll(SELECTORS.linkClickSelector.selector))
  }
}
