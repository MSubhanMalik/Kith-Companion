const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('messageAPI', {
  onShowMessage: (callback) => ipcRenderer.on('show-message-data', (_, data) => callback(data)),
  onHide: (callback) => ipcRenderer.on('hide-message-data', () => callback()),
  sendAction: (action) => ipcRenderer.send('message-action-clicked', action),
})
