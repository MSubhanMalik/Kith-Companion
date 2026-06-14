const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  showMessage: (data) => ipcRenderer.send('show-message', data),
  hideMessage: () => ipcRenderer.send('hide-message'),
  onMessageAction: (callback) => ipcRenderer.on('message-action', (_, action) => callback(action)),
})
