import https from 'https'
import fs from 'fs'
import EventRoute from './EventRoute'
const routers = new Array()

import TaskFrame from '../frame/TaskFrame'
let taskWindow: TaskFrame | null = null
/*
 * 关闭软件
 */
routers.push(
  new EventRoute('close-login', (api, data) => {
    api.mainWindow.close()
  })
)

/*
 * 拖拽窗口
 */
routers.push(
  new EventRoute('custom-adsorption', (api, { data }) => {
    // let x = data.appX;
    // let y = data.appY;
    // api.mainWindow.setPosition( x , y );
    let x = data.appX
    let y = data.appY

    let newBounds = {
      x,
      y,
      width: 900,
      height: 670
    }
    api.mainWindow.setBounds(newBounds)
  })
)

//   // 窗口拖拽
//   ipcMain.handle('custom-adsorption', (_event, res) => {
//     let x = res.appX
//     let y = res.appY

//     let newBounds = {
//       x,
//       y,
//       width: 900,
//       height: 670
//     }
//     mainWindow.setBounds(newBounds)
//     // 使用setPositon在Windows系统设置缩放不为100%时拖拽会导致窗口放大
//     // mainWindow.setPosition( x , y )
//   })

/*
 * 最小化
 */
routers.push(
  new EventRoute('min-win', (api, data) => {
    api.mainWindow.minimize()
  })
)

/*
 * 最大化
 */
routers.push(
  new EventRoute('max-win', (api, data) => {
    if (api.mainWindow.isFullScreen()) {
      api.mainWindow.setFullScreen(false)
    } else {
      api.mainWindow.setFullScreen(true)
    }
  })
)

/*
 * 退出软件
 */
routers.push(
  new EventRoute('win-close', (api, data) => {
    api.app.exit()
  })
)

/*
 * 退出登录
 */
routers.push(
  new EventRoute('out-login', (api, data) => {
    //窗口大小
    api.mainWindow.setSize(900, 670)
    //窗口居中
    api.mainWindow.center()
    //窗口大小可以修改
    api.mainWindow.setResizable(false)
  })
)

/*
 * 进入后台管理系统首页
 */
routers.push(
  new EventRoute('resize-window', (api, _data) => {
    //窗口大小
    api.mainWindow.setSize(1360, 760)
    //窗口最小值
    api.mainWindow.setMinimumSize(1000, 500)
    //窗口居中
    api.mainWindow.center()
    //窗口大小可以修改
    api.mainWindow.setResizable(true)
  })
)

/*
 * 打开窗口
 */
routers.push(
  new EventRoute('open-window-frame', (api, { data }) => {
    //下载任务
    if (data.url == '/tasklist') {
      //窗口不存在或者被销毁时创建窗口
      if (taskWindow == null || taskWindow.isDestroyed()) {
        taskWindow = new TaskFrame(data.url)
        taskWindow.create()
      } else {
        //窗口存在时显示窗口
        taskWindow.show()
      }
    }
  })
)

/*
 * 异步下载 ： 关闭窗口
 */
routers.push(
  new EventRoute('task-close', (api, { data }) => {
    taskWindow?.destroy()
    taskWindow = null
  })
)

/*
 * 异步下载 ： 下载
 */
routers.push(
  new EventRoute('download-http-file', (api, { data }) => {
    const url = data.url
    const fileName = url.substring(url.lastIndexOf('/') + 1)
    https.get(url, (res) => {
      api.dialog
        .showSaveDialog({
          title: '请选择保存的位置',
          defaultPath: fileName
        })
        .then((result) => {
          if (result.filePath) {
            const file = fs.createWriteStream(result.filePath)
            res.pipe(file)
            file
              .on('finish', () => {
                file.close()
                api.dialog.showMessageBox({
                  title: '提示信息',
                  message: '下载完成',
                  type: 'info'
                })
              })
              .on('error', (err) => {
                api.dialog.showMessageBox({
                  title: '提示信息',
                  message: err,
                  type: 'error'
                })
              })
          }
        })
    })
  })
)

export default routers
