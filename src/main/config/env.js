import dotenv from 'dotenv'
import path from 'path'
import { app } from 'electron'

// In electron-vite development environment, process.cwd() points to the project root.
const isDev = !app.isPackaged
const envPath = isDev
  ? path.resolve(process.cwd(), '.env')
  : path.resolve(process.resourcesPath, '.env')

dotenv.config({ path: envPath })

const MONGODB_URI = process.env.MONGODB_URI

// Validate critical environment variables
if (!MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI is not defined in the environment variables.')
} else {
  console.log('Database URI Configuration loaded successfully (existence verified).')
}

export const config = {
  mongodb: {
    uri: MONGODB_URI || ''
  },
  isDev
}
