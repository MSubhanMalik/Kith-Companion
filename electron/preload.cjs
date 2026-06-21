const { contextBridge, ipcRenderer, webUtils } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  showMessage: (data) => ipcRenderer.send('show-message', data),
  hideMessage: () => ipcRenderer.send('hide-message'),
  onMessageAction: (callback) => ipcRenderer.on('message-action', (_, action) => callback(action)),
  onNudgeArrived: (callback) => ipcRenderer.on('nudge-arrived', (_, data) => callback(data)),
  onNudgeDismissed: (callback) => ipcRenderer.on('nudge-dismissed', () => callback()),
  openApp: () => ipcRenderer.send('open-app'),
  openAppRoute: (route) => ipcRenderer.send('open-app-route', route),
  getFilePath: (file) => webUtils.getPathForFile(file),
  readFile: (filePath) => ipcRenderer.send('read-file', filePath),
})
