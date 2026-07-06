import { MongoClient } from 'mongodb'
import { configService } from '../config/ConfigService'

let client = null
let db = null
let connectionState = 'DISCONNECTED' // Default state before initialization
let onStateChangeCallback = null

/**
 * Register a callback to be notified when connection state changes.
 * @param {Function} callback The state change callback.
 */
export function setOnStateChange(callback) {
  onStateChangeCallback = callback
}

/**
 * Internal helper to update connection state and trigger callbacks.
 * @param {string} newState The new state.
 */
export function updateState(newState) {
  connectionState = newState
  if (onStateChangeCallback) {
    onStateChangeCallback(newState)
  }
}

/**
 * Retrieve the current connection state.
 * @returns {string} The connection state.
 */
export function getConnectionState() {
  if (db) return 'CONNECTED'
  return connectionState
}

/**
 * Connect to MongoDB Atlas.
 * @returns {Promise<Db>} The database instance.
 */
export async function connect() {
  if (db) return db

  const uri = await configService.getMongoUri()

  if (!uri) {
    updateState('NOT_CONFIGURED')
    return null
  }

  updateState('CONNECTING')

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('media_scoring')
    console.log('Successfully connected to MongoDB Atlas.')
    updateState('CONNECTED')
    return db
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error.message)
    updateState('FAILED')
    throw error
  }
}

/**
 * Retrieve the active database instance.
 * @returns {Db} The database instance.
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Please call connect() first.')
  }
  return db
}

/**
 * Disconnect the database connection.
 */
export async function disconnect() {
  if (client) {
    try {
      await client.close()
      db = null
      client = null
      updateState('DISCONNECTED')
      console.log('MongoDB connection closed.')
    } catch (error) {
      console.error('Error closing MongoDB connection:', error.message)
    }
  }
}
