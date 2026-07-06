import { ipcMain, BrowserWindow } from 'electron'

export function registerPdfIPCHandlers() {
  ipcMain.handle('pdf:printHtml', async (_, htmlString) => {
    return new Promise((resolve, reject) => {
      let win = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      })

      win.webContents.on('did-finish-load', async () => {
        try {
          const pdfBuffer = await win.webContents.printToPDF({
            preferCSSPageSize: true,
            printBackground: true,
            landscape: false
          })
          win.close()
          win = null
          resolve(pdfBuffer)
        } catch (error) {
          if (win) win.close()
          reject(error)
        }
      })

      win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlString)}`)
    })
  })
}
