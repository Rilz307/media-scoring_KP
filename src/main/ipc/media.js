import { ipcMain } from 'electron'
import { MediaRepository } from '../repositories/MediaRepository'

/**
 * Register media-related IPC listeners for the Main Process.
 */
export function registerMediaIPCHandlers() {
  ipcMain.handle('media:getAll', async () => {
    try {
      return await MediaRepository.getAll()
    } catch (error) {
      console.error('IPC Handler media:getAll error:', error.message)
      throw error
    }
  })

  ipcMain.handle('media:getById', async (event, id) => {
    try {
      return await MediaRepository.getById(id)
    } catch (error) {
      console.error(`IPC Handler media:getById error for ID ${id}:`, error.message)
      throw error
    }
  })
}
