import { BrowserWindow } from 'electron'
import { join } from 'path'

export default class LoadingFrame {
  #frame

  create() {
    // 创建一个新的浏览器窗口
    this.#frame = new BrowserWindow({
      width: 600,
      height: 350,
      frame: false,
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        sandbox: false,
        preload: join(__dirname, '../preload/index.js')
      }
    })

    // 打开开发者工具
    /*if(is.dev){
       this.#frame.webContents.openDevTools()
    }*/

    // 加载loading.html文件
    this.#frame.loadFile(join(__dirname, '../../resources/loading/loading.html'))

    // 窗口准备好后，创建一个新的AppUpdater实例并显示窗口
    this.#frame.on('ready-to-show', () => {
      // this.#frame.webContents.session.clearStorageData()
      // new AppUpdater(this.#frame)
      this.#frame.show()
    })

    // 窗口关闭时，将其设置为null
    this.#frame.on('closed', () => {
      this.#frame = null
    })
  }

  // 显示窗口
  show() {
    this.#frame.show()
  }

  close() {
    this.#frame.close()
  }

  // 隐藏窗口
  hide() {
    this.#frame.hide()
  }

  // 销毁窗口
  destroy() {
    this.#frame.close()
    this.#frame.destroy()
  }
}
