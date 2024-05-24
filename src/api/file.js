import axios, { msgType } from '@/utils/axios'

/**
 * 上传接口路径
 */
export const uploadPath = `${import.meta.env.VITE_FILE_BASE_URL}/upload`

/**
 * 上传
 * @param { File | FileList } file 文件对象
 * @param { Object } params 其它参数
 * @returns
 */
export function upload(file, params) {
  if (!file)
    return Promise.reject(new Error('请选择文件'))
  const data = {
    params,
  }

  if (file instanceof FileList)
    data.file = file

  else if (file instanceof File)
    data.file = [file]
  else
    return Promise.reject(new Error('file参数类型错误'))

  return axios.post('/upload', data, {
    baseURL: import.meta.env.VITE_FILE_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    successMsgType: msgType.msg,
  })
}

/**
 * 删除
 * @param { String } filePath 文件路径
 * @returns
 */
export function remove(filePath) {
  const params = { filePath }
  return axios.get('/remove', {
    baseURL: import.meta.env.VITE_FILE_BASE_URL,
    params,
    successMsgType: msgType.msg,
  })
}

/**
 * 获取下载地址
 * @param {String} filePath 文件路径
 * @param {Boolean} noKeep 强制不使用缓存
 * @returns
 */
export function getFileDownloadUrl(filePath, noKeep = false) {
  if (noKeep)
    return `${import.meta.env.VITE_FILE_BASE_URL}/download?filePath=${filePath}&_t=${Date.now()}`
  else
    return `${import.meta.env.VITE_FILE_BASE_URL}/download?filePath=${filePath}`
}

/**
 * 下载
 * @param {*} filePath 文件路径
 * @returns
 */
export function download(filePath) {
  const params = { filePath }
  return axios.get('/download', {
    baseURL: import.meta.env.VITE_FILE_BASE_URL,
    params,
    responseType: 'blob',
  })
}

/**
 * 下载文件到客户端
 * @param {*} byteData 二进制数据
 * @param {*} fileName 文件名称
 */
export function downloadBlobFile(byteData, fileName) {
  const blob = new Blob([byteData])
  const URL = window.URL.createObjectURL(blob)

  const listNode = document.createElement('a')
  listNode.download = fileName
  listNode.style.display = 'none'
  listNode.href = URL // 文件流生成的url
  document.body.appendChild(listNode)
  listNode.click() // 模拟在按钮上实现一次鼠标点击
  window.URL.revokeObjectURL(listNode.href) // 释放 URL 对象
  document.body.removeChild(listNode) // 移除 a 标签
}
