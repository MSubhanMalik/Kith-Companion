const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dimAPI', {
  onReadingStarted: (callback) => ipcRenderer.on('reading-started', (_, fileName) => callback(fileName)),
  onReadingStopped: (callback) => ipcRenderer.on('reading-stopped', () => callback()),
})
