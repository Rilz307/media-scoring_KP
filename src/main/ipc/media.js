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

  ipcMain.handle('media:create', async (event, data) => {
    try {
      return await MediaRepository.create(data)
    } catch (error) {
      console.error('IPC Handler media:create error:', error.message)
      throw error
    }
  })

  ipcMain.handle('media:update', async (event, id, data) => {
    try {
      return await MediaRepository.update(id, data)
    } catch (error) {
      console.error(`IPC Handler media:update error for ID ${id}:`, error.message)
      throw error
    }
  })

  ipcMain.handle('media:delete', async (event, id) => {
    try {
      return await MediaRepository.delete(id)
    } catch (error) {
      console.error(`IPC Handler media:delete error for ID ${id}:`, error.message)
      throw error
    }
  })
}
