const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appAPI', {
  onFileContent: (callback) => ipcRenderer.on('file-content', (_, data) => callback(data)),
})
