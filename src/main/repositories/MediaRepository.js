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
}
