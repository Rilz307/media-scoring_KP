const MediaService = {
  /**
   * Fetch all media records from the database.
   * @returns {Promise<Array>} List of media documents.
   */
  async getAll() {
    try {
      return await window.api.media.getAll()
    } catch (error) {
      console.error('MediaService.getAll failed:', error.message || error)
      throw error
    }
  },

  /**
   * Fetch a single media record by ID.
   * @param {string} id The media document ID.
   * @returns {Promise<Object|null>} The media document, or null if not found.
   */
  async getById(id) {
    try {
      return await window.api.media.getById(id)
    } catch (error) {
      console.error(`MediaService.getById failed for ID ${id}:`, error.message || error)
      throw error
    }
  }
}

export default MediaService
