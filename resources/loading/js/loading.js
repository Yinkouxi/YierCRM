window.electron.ipcRenderer.on('main-to-renderer', (e, data) => {
  let text = document.getElementsByClassName('text')[0]
  if (data.name == 'checking-for-update') {
    text.innerText = data.data ? data.msg + data.data : data.msg
  } else if (data.name == 'update-available') {
    text.innerText = data.data ? data.msg + data.data : data.msg
  } else if (data.name == 'update-not-available') {
    text.innerText = data.data ? data.msg + data.data : data.msg
  } else if (data.name == 'download-progress') {
    text.innerText = data.data ? data.msg + data.data.toFixed(2) + '%' : data.msg
  } else if (data.name == 'update-downloaded') {
    text.innerText = data.data ? data.msg + data.data.toFixed(2) + '%' : data.msg
  }

  window.electron.ipcRenderer.invoke('renderer-to-main', data)
})
