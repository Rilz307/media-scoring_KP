import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('MONGODB_URI environment variable is not set.')
  process.exit(1)
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 })

try {
  await client.connect()
  await client.db().admin().ping()
  console.log('MongoDB keep-alive ping succeeded.')
} catch (error) {
  console.error('MongoDB keep-alive ping failed:', error.message)
  process.exitCode = 1
} finally {
  await client.close()
}
