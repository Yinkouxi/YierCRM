import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import LoadingFrame from './frame/LoadingFrame'
import MainFrame from './frame/MainFrame'
import routers from './router/router.template'
import EventRouter from './router/EventRouter'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const eventRouter = new EventRouter()

  let loadingFrame = new LoadingFrame()
  loadingFrame.create()

  let mainWindow = new MainFrame()
  mainWindow.create()


  eventRouter.addApi('mainWindow', mainWindow)
  eventRouter.addApi('loadingFrame', loadingFrame)
  eventRouter.addApi('dialog', dialog)
  eventRouter.addApi('app', app)
  eventRouter.addRouters(routers)

  //渲染进程 向 主进程通信 : 主窗口
  ipcMain.handle('renderer-to-main', (_e, data) => {
    eventRouter.router(data)
  })

  //渲染进程 向 主进程通信 : 异步下载窗口
  ipcMain.handle('renderer-to-task', (_e, data) => {
    eventRouter.router(data)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow.create()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
