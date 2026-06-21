const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appAPI', {
  onFileContent: (callback) => ipcRenderer.on('file-content', (_, data) => callback(data)),
  googleAuth: () => ipcRenderer.invoke('google-auth'),
  pushNudge: (data) => ipcRenderer.send('push-nudge', data),
  dismissNudge: () => ipcRenderer.send('dismiss-nudge'),
})
