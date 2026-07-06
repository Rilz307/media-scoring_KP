import { ipcMain } from 'electron'
import { MongoClient } from 'mongodb'
import { connect, disconnect, getConnectionState, updateState } from '../database/connection'
import { configService } from '../config/ConfigService'

/**
 * Register database-related IPC listeners for the Main Process.
 */
export function registerDatabaseIPCHandlers() {
  ipcMain.handle('db:getConnectionStatus', () => {
    try {
      return getConnectionState()
    } catch (error) {
      console.error('IPC Handler db:getConnectionStatus error:', error.message)
      return 'FAILED'
    }
  })

  ipcMain.handle('db:retryConnection', async () => {
    try {
      await connect()
      return { success: true, status: 'CONNECTED' }
    } catch (error) {
      console.error('IPC Handler db:retryConnection error:', error.message)
      return { success: false, error: error.message, status: 'FAILED' }
    }
  })

  ipcMain.handle('db:getConfig', async () => {
    try {
      const uri = await configService.getMongoUri()
      return { success: true, uri: uri || '' }
    } catch (error) {
      console.error('IPC Handler db:getConfig error:', error.message)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('db:saveConfig', async (_, uri) => {
    try {
      await configService.setMongoUri(uri)
      await connect() // connect() now reads from configService and updates state
      return { success: true, status: 'CONNECTED' }
    } catch (error) {
      console.error('IPC Handler db:saveConfig error:', error.message)
      return { success: false, error: error.message, status: 'FAILED' }
    }
  })

  ipcMain.handle('db:testConnection', async (_, uri) => {
    let testClient = null
    try {
      testClient = new MongoClient(uri)
      await testClient.connect()
      await testClient.db().admin().ping()

      let clusterName = 'Unknown Cluster'
      try {
        const url = new URL(uri)
        clusterName = url.hostname
      } catch {
        // ignore parse error
      }

      return { success: true, metadata: { cluster: clusterName, database: 'media_scoring' } }
    } catch (error) {
      console.error('IPC Handler db:testConnection error:', error.message)
      return { success: false, error: error.message }
    } finally {
      if (testClient) {
        await testClient.close()
      }
    }
  })
  ipcMain.handle('db:disconnect', async () => {
    try {
      await disconnect()
      return { success: true, status: 'DISCONNECTED' }
    } catch (error) {
      console.error('IPC Handler db:disconnect error:', error.message)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('db:forgetConfig', async () => {
    try {
      await disconnect()
      await configService.clearMongoUri()
      updateState('NOT_CONFIGURED')
      return { success: true, status: 'NOT_CONFIGURED' }
    } catch (error) {
      console.error('IPC Handler db:forgetConfig error:', error.message)
      return { success: false, error: error.message }
    }
  })
}
