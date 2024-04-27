import { client } from '@config/alioss'
import { ElMessage } from 'element-plus'
import { nanoid } from 'nanoid'
interface Tool {
  dateFormat(date: string | number | Date, fmt?: string): string
  oss?: {
    upload(file: File): any
  }
}

const tool: Tool = {
  dateFormat: function (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    date = new Date(date)
    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  },
  oss: {
    upload: (file: File) => {
      //上传的文件名称
      const uuid: string = nanoid()
      //文件的后缀名
      const index: number = file.name.lastIndexOf('.')
      const suffix: string = file.name.substring(index + 1)
      //二级目录名称
      const currentDate: string = tool.dateFormat(new Date(), 'yyyy-MMMM-dd')
      //完整的上传路径
      let fileName: string = 'xiaoluxian-crm/' + currentDate + '/' + uuid + '.' + suffix
      return client.multipartUpload(fileName, file, {
        progress: function (p: number) {
          console.log('上传进度', p)
        }
      })
    }
  }
}

export default tool
