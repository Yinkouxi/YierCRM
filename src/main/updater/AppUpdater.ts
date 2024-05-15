import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { is } from '@electron-toolkit/utils'
import path from 'path'

export default class AppUpdater {
  constructor(window) {
    if (is.dev) {
      Object.defineProperty(app, 'isPackaged', {
        get() {
          return true
        }
      })
    }

    // 通过线上URL对比是否需要更新
    autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
    // 检查是否有新版本
    autoUpdater.on('checking-for-update', () => {
      console.log('== is or no new ==')
      window.webContents.send('main-to-renderer', {
        name: 'checking-for-update',
        event: 'event',
        msg: '检查是否有新版本',
        data: null
      })
    })
    // 发现新版本
    autoUpdater.on('update-available', () => {
      console.log('== find new==')
      window.webContents.send('main-to-renderer', {
        name: 'update-available',
        event: 'event',
        msg: '发现新版本，准备下载',
        data: null
      })
    })
    // 没有新版本
    autoUpdater.on('update-not-available', () => {
      window.webContents.send('main-to-renderer', {
        name: 'update-not-available',
        event: 'event',
        msg: '当前版本已是最新版本，无需更新',
        data: null
      })
    })
    // 下载进度
    autoUpdater.on('download-progress', (progressInfo) => {
      window.webContents.send('main-to-renderer', {
        name: 'download-progress',
        event: 'event',
        msg: '正在下载',
        data: progressInfo.percent
      })
    })
    // 下载完成
    autoUpdater.on('update-downloaded', () => {
      console.log('==over update==')
      window.webContents.send('main-to-renderer', {
        name: 'update-downloaded',
        event: 'event',
        msg: '下载完成，准备安装',
        data: null
      })
      dialog
        .showMessageBox(window, {
          title: '安装新版本',
          message: '新版本已下载完成，是否立即安装？',
          type: 'info',
          buttons: ['是，立即安装']
        })
        .then(() => {
          // 退出开始直接安装
          autoUpdater.quitAndInstall()
        })
    })
    // error
    // autoUpdater.on('error', (e) => {console.log('error::::::',e)})
    //开发环境
    // autoUpdater.checkForUpdates()
    // 生产环境
    autoUpdater.checkForUpdatesAndNotify()
  }
}
