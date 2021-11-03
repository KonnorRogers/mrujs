import '../mrujs'
import { Locateable } from '../../../types'

export interface BlobRecordAttributesInterface extends Record<string, unknown> {
  filename?: string
  content_type?: string
  byte_size?: number
  checksum?: string
  direct_upload?: Record<string, unknown>
}

export interface DirectUploadData extends Record<string, unknown> {
  headers?: Record<string, string>
  url?: Locateable
}

export class BlobRecord {
  file: File
  checksum: string
  url: Locateable
  callback: Function
  attributes: BlobRecordAttributesInterface
  xhr: XMLHttpRequest
  directUploadData?: DirectUploadData

  constructor (file: File, checksum: string, url: string) {
    this.file = file
    this.url = url
    this.checksum = checksum
    this.callback = () => {}

    this.attributes = {
      filename: file.name,
      content_type: file.type ?? 'application/octet-stream',
      byte_size: file.size,
      checksum: checksum
    }

    this.xhr = new XMLHttpRequest()
    this.xhr.open('POST', this.url, true)
    this.xhr.responseType = 'json'
    this.xhr.setRequestHeader('Content-Type', 'application/json')
    this.xhr.setRequestHeader('Accept', 'application/json')
    this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    const csrfToken = window.mrujs.csrfToken()
    if (csrfToken != null) {
      this.xhr.setRequestHeader('X-CSRF-Token', csrfToken)
    }

    this.xhr.addEventListener('load', event => this.requestDidLoad(event))
    this.xhr.addEventListener('error', event => this.requestDidError(event))
  }

  get status (): number {
    return this.xhr.status
  }

  get response (): Record<string, unknown> {
    const { responseType, response } = this.xhr
    if (responseType === 'json') {
      return response
    } else {
      // Shim for IE 11: https://connect.microsoft.com/IE/feedback/details/794808
      return JSON.parse(response)
    }
  }

  create (callback: Function): void {
    this.callback = callback
    this.xhr.send(JSON.stringify({ blob: this.attributes }))
  }

  requestDidLoad (event: Event): void {
    if (this.status >= 200 && this.status < 300) {
      const { response } = this
      // eslint-disable-next-line
      const { direct_upload } = response
      delete response.direct_upload
      this.attributes = response
      this.directUploadData = direct_upload as DirectUploadData
      this.callback(null, this.attributes)
    } else {
      this.requestDidError(event)
    }
  }

  requestDidError (_event: Event): void {
    this.callback(`Error creating Blob for "${this.file.name}". Status: ${this.status}`)
  }
}
