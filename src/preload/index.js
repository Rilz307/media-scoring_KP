import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  media: {
    getAll: () => ipcRenderer.invoke('media:getAll'),
    getById: (id) => ipcRenderer.invoke('media:getById', id),
    create: (data) => ipcRenderer.invoke('media:create', data),
    update: (id, data) => ipcRenderer.invoke('media:update', id, data),
    delete: (id) => ipcRenderer.invoke('media:delete', id)
  },
  db: {
    getConnectionStatus: () => ipcRenderer.invoke('db:getConnectionStatus'),
    retryConnection: () => ipcRenderer.invoke('db:retryConnection'),
    testConnection: (uri) => ipcRenderer.invoke('db:testConnection', uri),
    getConfig: () => ipcRenderer.invoke('db:getConfig'),
    saveConfig: (uri) => ipcRenderer.invoke('db:saveConfig', uri),
    disconnect: () => ipcRenderer.invoke('db:disconnect'),
    forgetConfig: () => ipcRenderer.invoke('db:forgetConfig'),
    onConnectionStateChanged: (callback) => {
      const listener = (event, status) => callback(status)
      ipcRenderer.on('db:connection-state-changed', listener)
      return () => {
        ipcRenderer.removeListener('db:connection-state-changed', listener)
      }
    }
  },
  pdf: {
    printHtml: (html) => ipcRenderer.invoke('pdf:printHtml', html)
  },
  attachments: {
    upload: (filePath, originalName, mimeType) =>
      ipcRenderer.invoke('attachment:upload', filePath, originalName, mimeType),
    download: (fileId, defaultFilename) =>
      ipcRenderer.invoke('attachment:download', fileId, defaultFilename),
    getBuffer: (fileId) => ipcRenderer.invoke('attachment:getBuffer', fileId),
    openNative: (fileId, filename) => ipcRenderer.invoke('attachment:openNative', fileId, filename),
    delete: (fileId) => ipcRenderer.invoke('attachment:delete', fileId),
    getStorageStats: () => ipcRenderer.invoke('attachment:getStorageStats')
  },
  system: {
    openExternal: (url) => {
      const { shell } = require('electron')
      shell.openExternal(url)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
