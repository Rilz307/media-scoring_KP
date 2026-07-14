import { ipcMain, dialog, shell, app } from 'electron'
import { join } from 'path'
import { AttachmentRepository } from '../repositories/AttachmentRepository'

/**
 * Register attachment-related IPC listeners for the Main Process.
 */
export function registerAttachmentIPCHandlers() {
  // 1. Upload Local File to GridFS
  ipcMain.handle('attachment:upload', async (event, filePathOrBuffer, originalName, mimeType) => {
    try {
      return await AttachmentRepository.upload(filePathOrBuffer, originalName, mimeType)
    } catch (error) {
      console.error('IPC Handler attachment:upload error:', error.message)
      throw error
    }
  })

  // 2. Download File to Chosen Path via Native Save Dialog
  ipcMain.handle('attachment:download', async (event, fileId, defaultFilename) => {
    try {
      const result = await dialog.showSaveDialog({
        defaultPath: defaultFilename,
        filters: [{ name: 'All Files (*.*)', extensions: ['*'] }]
      })

      if (result.canceled || !result.filePath) {
        return { success: false, message: 'Unduh dibatalkan.' }
      }

      await AttachmentRepository.download(fileId, result.filePath)
      return { success: true, filePath: result.filePath }
    } catch (error) {
      console.error('IPC Handler attachment:download error:', error.message)
      throw error
    }
  })

  // 3. Get Binary Buffer for In-App Preview (Images/PDFs)
  ipcMain.handle('attachment:getBuffer', async (event, fileId) => {
    try {
      const buffer = await AttachmentRepository.getBuffer(fileId)
      // Electron will serialize Buffer as a Uint8Array on the Renderer side
      return buffer
    } catch (error) {
      console.error('IPC Handler attachment:getBuffer error:', error.message)
      throw error
    }
  })

  // 4. Download to OS Temp & Open with Default System Application
  ipcMain.handle('attachment:openNative', async (event, fileId, filename) => {
    try {
      const tempDir = app.getPath('temp')
      const tempFilePath = join(tempDir, `preview_${Date.now()}_${filename}`)

      await AttachmentRepository.download(fileId, tempFilePath)
      const error = await shell.openPath(tempFilePath)

      if (error) {
        throw new Error(error)
      }

      return { success: true, filePath: tempFilePath }
    } catch (error) {
      console.error('IPC Handler attachment:openNative error:', error.message)
      throw error
    }
  })

  // 5. Delete File from GridFS
  ipcMain.handle('attachment:delete', async (event, fileId) => {
    try {
      return await AttachmentRepository.delete(fileId)
    } catch (error) {
      console.error(`IPC Handler attachment:delete error for ID ${fileId}:`, error.message)
      throw error
    }
  })

  // 6. Retrieve Attachment Storage Stats
  ipcMain.handle('attachment:getStorageStats', async () => {
    try {
      return await AttachmentRepository.getStorageStats()
    } catch (error) {
      console.error('IPC Handler attachment:getStorageStats error:', error.message)
      throw error
    }
  })
}
