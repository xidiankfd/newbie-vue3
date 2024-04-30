import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FiveNProgress } from '@/utils/nprogress'
import { useRouteStore } from '@/stores/modules/route'
import { useUserStore } from '@/stores/modules/user'
import { t } from '@/i18n'

import router from '@/router'
import useAuth from '@/hooks/useAuth'

// 请求超时
const timeout = import.meta.env.VITE_API_TIMEOUT
// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: timeout ? Number.parseInt(timeout) : 0,
})

// 定义成功响应码
export const successCode = 200
// 响应结果映射
export const resultProp = {
  data: 'data',
  code: 'code',
  message: 'msg',
  ok: 'ok',
}
// 响应后消息提示类型
export const msgType = {
  none: 'none', // 无提示
  msg: 'msg', // 消息提示
  box: 'box', // 弹框提示
}

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
  FiveNProgress.start() // 请求进度条开始
  // 请求头携带token
  const { tokenInfo } = useAuth()
  if (tokenInfo)
    config.headers[tokenInfo.tokenName] = tokenInfo.tokenValue

  // 添加时间戳参数
  config.url = `${config.url}?_t=${new Date().getTime()}`

  // 默认的错误消息提示类型
  if (!config.errorMsgType)
    config.errorMsgType = 'msg'

  return config
}, (error) => {
  FiveNProgress.done() // 请求进度条结束
  return Promise.reject(error)
})

// 响应拦截器
axiosInstance.interceptors.response.use((res) => {
  if (typeof res.data != 'object' || res.data instanceof Blob) {
    FiveNProgress.done()
    return res
  }
  // 响应文件流的情况
  if (res.status === 200 && res.headers['content-type'] === 'application/octet-stream') {
    FiveNProgress.done()
    return res
  }

  const routeStore = useRouteStore()
  const userStore = useUserStore()
  const { setTokenInfo } = useAuth()
  const { data, config } = res
  // 获取请求时配置的成功消息提示类型与错误消息提示类型
  const { errorMsgType, successMsgType } = config
  const code = data[resultProp.code]
  // 业务异常响应时
  if (code !== successCode) {
    if (errorMsgType && errorMsgType !== 'none')
      errorMessage(data[resultProp.message] || t('http.error'), errorMsgType)
    switch (code) {
      case 401:
        setTokenInfo(null)
        routeStore.$reset()
        userStore.userInfo = null
        router.push('/login')
        break
    }
  }
  // 正常响应时
  else {
    if (successMsgType && successMsgType !== 'none')
      successMessage(data[resultProp.message] || t('http.success'), successMsgType)
  }
  FiveNProgress.done() // 请求进度条结束
  return data
}, (err) => {
  if (!err.response) {
    ElMessage.error(err.message)
    FiveNProgress.done()
    return Promise.reject(err)
  }

  const routeStore = useRouteStore()
  const userStore = useUserStore()
  const { setTokenInfo } = useAuth()
  const { status, statusText, data } = err.response
  let message = data[resultProp.message]
  switch (status) {
    case 401:
      message = message || t('http.error401')
      setTokenInfo(null)
      routeStore.$reset()
      userStore.userInfo = null
      router.push('/login')
      break
    case 403:
      message = message || t('http.error403')
      break
    case 500:
      message = message || t('http.error500')
      break
    case 404:
      message = message || t('http.error404')
      break
    default:
      message = message || statusText
  }
  ElMessage.error(message)
  FiveNProgress.done()
  return Promise.reject(err)
})

// 错误消息处理
function errorMessage(message, messageType) {
  if (messageType === msgType.msg) {
    ElMessage.error(message)
  }
  else if (messageType === msgType.box) {
    ElMessageBox.confirm(
      message,
      t('messageBox.hint'),
      {
        showCancelButton: false,
        confirmButtonText: t('messageBox.iKnow'),
        type: 'error',
        showClose: false,
        lockScroll: false,
      },
    )
  }
}

// 成功消息处理
function successMessage(message, messageType) {
  if (messageType === msgType.msg) {
    ElMessage.success(message)
  }
  else if (messageType === msgType.box) {
    ElMessageBox.confirm(
      message,
      t('messageBox.hint'),
      {
        showCancelButton: false,
        confirmButtonText: t('messageBox.close'),
        type: 'success',
        showClose: false,
        lockScroll: false,
      },
    )
  }
}
export default axiosInstance
