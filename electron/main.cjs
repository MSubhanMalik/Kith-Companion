const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'

const PET_W = 140
const PET_H = 160
const MSG_W = 280
const MSG_H = 220
const PADDING = 16

let petWindow = null
let msgWindow = null

function createWindows() {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize

  const petX = screenW - PET_W - PADDING
  const petY = screenH - PET_H - PADDING

  petWindow = new BrowserWindow({
    width: PET_W,
    height: PET_H,
    x: petX,
    y: petY,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  msgWindow = new BrowserWindow({
    width: MSG_W,
    height: MSG_H,
    x: petX + PET_W - MSG_W,
    y: petY - MSG_H - 8,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload-message.cjs'),
    },
  })

  msgWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  if (isDev) {
    petWindow.loadURL('http://localhost:5173/#pet')
    msgWindow.loadURL('http://localhost:5173/#message')
  } else {
    petWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'pet' })
    msgWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'message' })
  }

  ipcMain.on('show-message', (_, data) => {
    if (!msgWindow || !petWindow) return
    const petBounds = petWindow.getBounds()
    msgWindow.setBounds({
      x: petBounds.x + PET_W - MSG_W,
      y: petBounds.y - MSG_H - 8,
      width: MSG_W,
      height: MSG_H,
    })
    msgWindow.webContents.send('show-message-data', data)
    msgWindow.showInactive()
  })

  ipcMain.on('hide-message', () => {
    if (!msgWindow) return
    msgWindow.webContents.send('hide-message-data')
    setTimeout(() => msgWindow.hide(), 300)
  })

  ipcMain.on('message-action-clicked', (_, action) => {
    if (!petWindow) return
    petWindow.webContents.send('message-action', action)
  })
}

app.whenReady().then(createWindows)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindows()
})
