import { GridFSBucket, ObjectId } from 'mongodb'
import fs from 'fs'
import { getDb } from '../database/connection'
import { ATTACHMENT_CONFIG } from '../config/attachmentConfig'

/**
 * GridFS Storage Provider Repository
 */
export class GridFsAttachmentRepository {
  /**
   * Helper to retrieve the 'attachments' GridFS bucket.
   * @returns {GridFSBucket}
   */
  static getBucket() {
    return new GridFSBucket(getDb(), { bucketName: 'attachments' })
  }

  /**
   * Upload file from local path or memory buffer into GridFS bucket.
   * @param {string|Buffer|Uint8Array} filePathOrBuffer - Local path or buffer.
   * @param {string} originalName - Sanitized original name.
   * @param {string} mimeType - File MIME type.
   * @returns {Promise<Object>} Uploaded file metadata details.
   */
  static async upload(filePathOrBuffer, originalName, mimeType) {
    try {
      if (
        filePathOrBuffer == null ||
        (typeof filePathOrBuffer !== 'string' &&
          !(filePathOrBuffer instanceof Uint8Array) &&
          !Buffer.isBuffer(filePathOrBuffer))
      ) {
        throw new Error(
          `Invalid attachment payload for "${originalName}": expected string path, Uint8Array, or Buffer but received ${filePathOrBuffer === null ? 'null' : typeof filePathOrBuffer}.`
        )
      }

      let fileBuffer
      if (typeof filePathOrBuffer === 'string') {
        fileBuffer = await fs.promises.readFile(filePathOrBuffer)
      } else {
        fileBuffer = Buffer.from(filePathOrBuffer)
      }
      const size = fileBuffer.length

      // 2. Setup GridFS stream
      const bucket = this.getBucket()
      const uploadStream = bucket.openUploadStream(originalName, {
        metadata: { mimeType }
      })

      // 3. Write buffer to GridFS
      await new Promise((resolve, reject) => {
        uploadStream.write(fileBuffer, (err) => {
          if (err) return reject(err)
          uploadStream.end((endErr) => {
            if (endErr) return reject(endErr)
            resolve()
          })
        })
      })

      return {
        fileId: uploadStream.id.toString(),
        originalName,
        mimeType,
        size
      }
    } catch (error) {
      console.error('Error in GridFsAttachmentRepository.upload:', error.message)
      throw error
    }
  }

  /**
   * Download a file from GridFS to a target local path.
   * @param {string} fileId - The GridFS ObjectId string.
   * @param {string} destPath - The local path to write the file.
   * @returns {Promise<string>} Output local path on success.
   */
  static async download(fileId, destPath) {
    try {
      const bucket = this.getBucket()
      const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))
      const writeStream = fs.createWriteStream(destPath)

      await new Promise((resolve, reject) => {
        downloadStream.pipe(writeStream).on('finish', resolve).on('error', reject)
      })

      return destPath
    } catch (error) {
      console.error('Error in GridFsAttachmentRepository.download:', error.message)
      throw error
    }
  }

  /**
   * Delete a file from GridFS.
   * @param {string} fileId - The GridFS ObjectId string.
   * @returns {Promise<boolean>} Success status.
   */
  static async delete(fileId) {
    try {
      const bucket = this.getBucket()
      await bucket.delete(new ObjectId(fileId))
      return true
    } catch (error) {
      console.error('Error in GridFsAttachmentRepository.delete:', error.message)
      throw error
    }
  }

  /**
   * Get file binary contents as Buffer.
   * @param {string} fileId - The GridFS ObjectId string.
   * @returns {Promise<Buffer>} The file buffer.
   */
  static async getBuffer(fileId) {
    try {
      const bucket = this.getBucket()
      const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))
      const chunks = []
      for await (const chunk of downloadStream) {
        chunks.push(chunk)
      }
      return Buffer.concat(chunks)
    } catch (error) {
      console.error('Error in GridFsAttachmentRepository.getBuffer:', error.message)
      throw error
    }
  }

  /**
   * Calculate attachment storage usage.
   * @returns {Promise<Object>} Statistics containing total size, file count, and limit.
   */
  static async getStorageStats() {
    try {
      const db = getDb()
      const filesColl = db.collection('attachments.files')
      const stats = await filesColl
        .aggregate([
          {
            $group: {
              _id: null,
              totalSize: { $sum: '$length' },
              totalFiles: { $sum: 1 }
            }
          }
        ])
        .toArray()

      return {
        totalSize: stats[0]?.totalSize || 0,
        totalFiles: stats[0]?.totalFiles || 0,
        limit: ATTACHMENT_CONFIG.totalStorageLimit
      }
    } catch (error) {
      console.error('Error in GridFsAttachmentRepository.getStorageStats:', error.message)
      throw error
    }
  }
}
