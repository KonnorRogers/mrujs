import { BlobRecord } from './blob_record'

export class BlobUpload {
  blob: BlobRecord
  file: File
  callback: Function
  xhr: XMLHttpRequest

  constructor (blob: BlobRecord) {
    this.blob = blob
    this.file = blob.file
    this.callback = () => {}

    const url = blob?.directUploadData?.url
    const headers = blob?.directUploadData?.headers

    if (url == null || headers == null) {
      throw new Error('No headers or url found for blob')
    }

    this.xhr = new XMLHttpRequest()
    this.xhr.open('PUT', url as string, true)
    this.xhr.responseType = 'text'

    for (const key in headers) {
      this.xhr.setRequestHeader(key, headers[key])
    }

    this.xhr.addEventListener('load', event => this.requestDidLoad(event))
    this.xhr.addEventListener('error', event => this.requestDidError(event))
  }

  create (callback: Function): void {
    this.callback = callback
    this.xhr.send(this.file.slice())
  }

  requestDidLoad (event: Event): void {
    const { status, response } = this.xhr
    if (status >= 200 && status < 300) {
      this.callback(null, response)
    } else {
      this.requestDidError(event)
    }
  }

  requestDidError (_event: Event): void {
    this.callback(`Error storing "${this.file.name}". Status: ${this.xhr.status}`)
  }
}
