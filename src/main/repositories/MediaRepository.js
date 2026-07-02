import { ObjectId } from 'mongodb'
import { getDb } from '../database/connection'

export class MediaRepository {
  /**
   * Helper to retrieve the 'media' collection.
   */
  static getCollection() {
    return getDb().collection('media')
  }

  /**
   * Retrieve all media documents from the database.
   * Converts the MongoDB ObjectId to a string for clean serialization.
   * @returns {Promise<Array>} A list of media documents.
   */
  static async getAll() {
    try {
      const collection = this.getCollection()
      const documents = await collection.find({}).toArray()
      return documents.map((doc) => ({
        ...doc,
        _id: doc._id.toString()
      }))
    } catch (error) {
      console.error('Error in MediaRepository.getAll:', error.message)
      throw error
    }
  }

  /**
   * Retrieve a single media document by its ID.
   * @param {string} id The 24-character hexadecimal ObjectId string.
   * @returns {Promise<Object|null>} The media document, or null if not found.
   */
  static async getById(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId format: ${id}`)
      }
      const collection = this.getCollection()
      const document = await collection.findOne({ _id: new ObjectId(id) })
      if (!document) return null

      return {
        ...document,
        _id: document._id.toString()
      }
    } catch (error) {
      console.error(`Error in MediaRepository.getById (${id}):`, error.message)
      throw error
    }
  }

  /**
   * Create a new media document.
   * @param {Object} data The media payload.
   * @returns {Promise<Object>} The created document with stringified _id.
   */
  static async create(data) {
    try {
      if (!data || !data.nama_media || !data.nama_media.trim()) {
        throw new Error('Nama media tidak boleh kosong.')
      }

      const collection = this.getCollection()
      const now = new Date()

      const newDocument = {
        ...data,
        createdAt: now,
        updatedAt: now
      }

      const result = await collection.insertOne(newDocument)
      return {
        ...newDocument,
        _id: result.insertedId.toString()
      }
    } catch (error) {
      console.error('Error in MediaRepository.create:', error.message)
      throw error
    }
  }

  /**
   * Update an existing media document. Preserves createdAt, updates updatedAt.
   * @param {string} id The 24-character hexadecimal ObjectId string.
   * @param {Object} data The updated fields.
   * @returns {Promise<Object>} The updated document.
   */
  static async update(id, data) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId format: ${id}`)
      }
      if (!data || !data.nama_media || !data.nama_media.trim()) {
        throw new Error('Nama media tidak boleh kosong.')
      }

      const collection = this.getCollection()
      const now = new Date()

      // Exclude _id and createdAt to avoid modifying them
      const updateData = { ...data }
      delete updateData._id
      delete updateData.createdAt
      const updatedFields = {
        ...updateData,
        updatedAt: now
      }

      const updateResult = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFields }
      )

      if (updateResult.matchedCount === 0) {
        throw new Error(`Media dengan ID ${id} tidak ditemukan.`)
      }

      const updatedDocument = await collection.findOne({ _id: new ObjectId(id) })
      return {
        ...updatedDocument,
        _id: updatedDocument._id.toString()
      }
    } catch (error) {
      console.error(`Error in MediaRepository.update (${id}):`, error.message)
      throw error
    }
  }

  /**
   * Delete a media document.
   * @param {string} id The 24-character hexadecimal ObjectId string.
   * @returns {Promise<Object>} Object indicating success status.
   */
  static async delete(id) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId format: ${id}`)
      }

      const collection = this.getCollection()
      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount === 0) {
        return { success: false, message: `Media dengan ID ${id} tidak ditemukan.` }
      }

      return { success: true, deletedCount: result.deletedCount }
    } catch (error) {
      console.error(`Error in MediaRepository.delete (${id}):`, error.message)
      throw error
    }
  }
}
