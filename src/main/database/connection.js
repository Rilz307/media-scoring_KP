import { MongoClient } from 'mongodb'
import { config } from '../config/env'

let client = null
let db = null

/**
 * Connect to MongoDB Atlas.
 * @returns {Promise<Db>} The database instance.
 */
export async function connect() {
  if (db) return db

  const uri = config.mongodb.uri
  if (!uri) {
    throw new Error('MongoDB connection URI is missing from configuration.')
  }

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('media_scoring')
    console.log('Successfully connected to MongoDB Atlas.')
    return db
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error.message)
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
 * Close the database connection.
 */
export async function close() {
  if (client) {
    try {
      await client.close()
      db = null
      client = null
      console.log('MongoDB connection closed.')
    } catch (error) {
      console.error('Error closing MongoDB connection:', error.message)
    }
  }
}
