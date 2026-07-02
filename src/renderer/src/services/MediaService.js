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
  },

  /**
   * Create a new media record.
   * @param {Object} data The media payload.
   * @returns {Promise<Object>} The created document.
   */
  async create(data) {
    try {
      return await window.api.media.create(data)
    } catch (error) {
      console.error('MediaService.create failed:', error.message || error)
      throw error
    }
  },

  /**
   * Update an existing media record.
   * @param {string} id The media document ID.
   * @param {Object} data The updated fields.
   * @returns {Promise<Object>} The updated document.
   */
  async update(id, data) {
    try {
      return await window.api.media.update(id, data)
    } catch (error) {
      console.error(`MediaService.update failed for ID ${id}:`, error.message || error)
      throw error
    }
  },

  /**
   * Delete a media record.
   * @param {string} id The media document ID.
   * @returns {Promise<Object>} Status indicating success status.
   */
  async delete(id) {
    try {
      return await window.api.media.delete(id)
    } catch (error) {
      console.error(`MediaService.delete failed for ID ${id}:`, error.message || error)
      throw error
    }
  }
}

export default MediaService
