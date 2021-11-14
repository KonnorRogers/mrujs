import { FileChecksum } from './file_checksum'
import { BlobRecord } from './blob_record'
import { BlobUpload } from './blob_upload'
import { DirectUploadController } from './direct_upload_controller'

let id = 0

export class DirectUpload {
  file: File
  url: string
  id: number
  delegate: DirectUploadController

  constructor (file: File, url: string, delegate: DirectUploadController) {
    this.id = ++id
    this.file = file
    this.url = url
    this.delegate = delegate
  }

  create (callback: Function): void {
    FileChecksum.create(this.file, (error: undefined | Error, checksum: string) => {
      if (error != null) {
        callback(error)
        return
      }

      const blob = new BlobRecord(this.file, checksum, this.url)
      notify(this.delegate, 'directUploadWillCreateBlobWithXHR', blob.xhr)

      blob.create((error: Error) => {
        if (error != null) {
          callback(error)
        } else {
          const upload = new BlobUpload(blob)
          notify(this.delegate, 'directUploadWillStoreFileWithXHR', upload.xhr)
          upload.create((error: Error) => {
            if (error != null) {
              callback(error)
            } else {
              callback(null, blob.attributes)
            }
          })
        }
      })
    })
  }
}

function notify (object: DirectUploadController, methodName: string, ...messages: any[]): void {
  if (object != null && typeof object[methodName] === 'function') {
    (object[methodName] as Function)(...messages)
  }

  return undefined
}
