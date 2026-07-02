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
