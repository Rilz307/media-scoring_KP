/**
 * Service to manage attachment operations in the React frontend.
 * Communicates with the Main Process via Electron Preload Bridge (window.api.attachments).
 */
const AttachmentService = {
  /**
   * Upload a file from a local path into GridFS storage.
   * @param {string} filePath - Absolute path on the local OS.
   * @param {string} originalName - Sanitized name of the file.
   * @param {string} mimeType - The MIME type.
   * @returns {Promise<Object>} The uploaded attachment details { fileId, originalName, mimeType, size }.
   */
  async upload(filePath, originalName, mimeType) {
    try {
      return await window.api.attachments.upload(filePath, originalName, mimeType)
    } catch (error) {
      console.error('AttachmentService.upload failed:', error.message || error)
      throw error
    }
  },

  /**
   * Download a file from GridFS storage. Opens a native OS Save Dialog.
   * @param {string} fileId - GridFS file identifier.
   * @param {string} defaultFilename - Fallback filename to show in save dialog.
   * @returns {Promise<Object>} Save result status { success, filePath }.
   */
  async download(fileId, defaultFilename) {
    try {
      return await window.api.attachments.download(fileId, defaultFilename)
    } catch (error) {
      console.error('AttachmentService.download failed:', error.message || error)
      throw error
    }
  },

  /**
   * Fetch binary contents of a file for local preview (e.g. image, PDF).
   * @param {string} fileId - GridFS file identifier.
   * @returns {Promise<Uint8Array>} Raw biner file content.
   */
  async getBuffer(fileId) {
    try {
      return await window.api.attachments.getBuffer(fileId)
    } catch (error) {
      console.error('AttachmentService.getBuffer failed:', error.message || error)
      throw error
    }
  },

  /**
   * Download file to OS temp directory and open it in native OS viewer.
   * Useful for office documents (DOCX, etc.) or default viewer preferences.
   * @param {string} fileId - GridFS file identifier.
   * @param {string} filename - Filename with extension.
   * @returns {Promise<Object>} Opening status.
   */
  async openNative(fileId, filename) {
    try {
      return await window.api.attachments.openNative(fileId, filename)
    } catch (error) {
      console.error('AttachmentService.openNative failed:', error.message || error)
      throw error
    }
  },

  /**
   * Delete a file from GridFS storage.
   * @param {string} fileId - GridFS file identifier.
   * @returns {Promise<boolean>} Success status.
   */
  async delete(fileId) {
    try {
      return await window.api.attachments.delete(fileId)
    } catch (error) {
      console.error('AttachmentService.delete failed:', error.message || error)
      throw error
    }
  },

  /**
   * Fetch total storage usage statistics.
   * @returns {Promise<Object>} Storage stats { totalSize, totalFiles, limit }.
   */
  async getStorageStats() {
    try {
      return await window.api.attachments.getStorageStats()
    } catch (error) {
      console.error('AttachmentService.getStorageStats failed:', error.message || error)
      throw error
    }
  }
}

export default AttachmentService
