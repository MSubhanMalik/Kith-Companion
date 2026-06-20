const { app, BrowserWindow, screen, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.env.NODE_ENV !== 'production'

const PET_W = 140
const PET_H = 160
const MSG_W = 320
const MSG_H = 300
const APP_W = 720
const APP_H = 580
const PADDING = 16

let petWindow = null
let msgWindow = null
let appWindow = null

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

  appWindow = new BrowserWindow({
    width: screenW,
    height: screenH,
    minWidth: 480,
    minHeight: 520,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#F5F0E8',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload-app.cjs'),
    },
  })

  if (isDev) {
    petWindow.loadURL('http://localhost:5173/#pet')
    msgWindow.loadURL('http://localhost:5173/#message')
    appWindow.loadURL('http://localhost:5173/#app')
  } else {
    petWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'pet' })
    msgWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'message' })
    appWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'app' })
  }

  appWindow.on('close', (e) => {
    e.preventDefault()
    appWindow.hide()
  })

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

  ipcMain.on('open-app', () => {
    if (!appWindow) return
    appWindow.show()
    appWindow.focus()
  })

  ipcMain.on('open-app-route', (_, route) => {
    if (!appWindow) return
    appWindow.show()
    appWindow.focus()
    appWindow.webContents.executeJavaScript(`window.location.hash = '#app/${route}'`)
  })

  ipcMain.on('read-file', (_, filePath) => {
    if (!appWindow) return
    try {
      const ext = path.extname(filePath).toLowerCase()
      const fileName = path.basename(filePath)

      if (ext === '.pdf') {
        const data = fs.readFileSync(filePath)
        const base64 = data.toString('base64')
        appWindow.webContents.send('file-content', { fileName, type: 'pdf', content: base64 })
      } else {
        const content = fs.readFileSync(filePath, 'utf-8')
        appWindow.webContents.send('file-content', { fileName, type: 'text', content })
      }

      appWindow.show()
      appWindow.focus()
      appWindow.webContents.executeJavaScript(`window.location.hash = '#app/reading'`)
    } catch (err) {
      console.error('Failed to read file:', err)
    }
  })
}

app.whenReady().then(createWindows)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindows()
})
