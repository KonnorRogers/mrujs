import SparkMD5 from 'spark-md5'

// @ts-expect-error
const fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice // eslint-disable-line

export class FileChecksum {
  file: File
  fileReader: FileReader
  chunkSize: number
  chunkCount: number
  chunkIndex: number
  callback: Function
  md5Buffer: SparkMD5.ArrayBuffer

  static create (file: File, callback: Function): void {
    const instance = new FileChecksum(file)
    instance.create(callback)
  }

  constructor (file: File) {
    this.file = file
    this.chunkSize = 2097152 // 2MB
    this.chunkCount = Math.ceil(this.file.size / this.chunkSize)
    this.chunkIndex = 0
    this.md5Buffer = new SparkMD5.ArrayBuffer()
    this.fileReader = new FileReader()
    this.callback = () => {}
  }

  create (callback: Function): void {
    this.callback = callback
    this.fileReader.addEventListener('load', (event: ProgressEvent<FileReader>) => this.fileReaderDidLoad(event))
    this.fileReader.addEventListener('error', (event: ProgressEvent<FileReader>) => this.fileReaderDidError(event))
    this.readNextChunk()
  }

  fileReaderDidLoad (event: ProgressEvent<FileReader>): void {
    if (event.target != null) {
      this.md5Buffer.append(event.target.result as ArrayBuffer)
    }

    if (!this.readNextChunk()) {
      const binaryDigest = this.md5Buffer.end(true)
      const base64digest = btoa(binaryDigest)
      this.callback(null, base64digest)
    }
  }

  fileReaderDidError (_event: ProgressEvent<FileReader>): void {
    this.callback(`Error reading ${this.file.name}`)
  }

  readNextChunk (): boolean {
    if (this.chunkIndex < this.chunkCount || (this.chunkIndex === 0 && this.chunkCount === 0)) {
      const start = this.chunkIndex * this.chunkSize
      const end = Math.min(start + this.chunkSize, this.file.size)
      const bytes = fileSlice.call(this.file, start, end)
      this.fileReader.readAsArrayBuffer(bytes)
      this.chunkIndex++
      return true
    } else {
      return false
    }
  }
}
