import { connect, disconnect } from './ujs'
import { DirectUpload } from './direct_upload'
import type { MrujsPluginInterface } from '../../../types'

export function ActiveStorage (): MrujsPluginInterface {
  return {
    name: 'ActiveStorage',
    connect,
    disconnect
  }
}

ActiveStorage.DirectUpload = DirectUpload
