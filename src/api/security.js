import axios, { msgType } from '@/utils/axios'

// 图片验证码
export function imageCaptchaApi() {
  return axios.get('/security/imageCaptcha')
}

// 登录
export function loginApi(data) {
  return axios.post('/security/login', data, { errorMsgType: msgType.box })
}
// 用户信息
export function userInfoApi() {
  return axios.get('/security/userInfo')
}

// 菜单/路由
export function menuListApi() {
  return axios.get('/security/menus')
}
// 登出
export function logoutApi() {
  return axios.post('/security/logout')
}
// 初始化管理员
export function initAdmin(data) {
  return axios.post('/security/initAdmin', data, { errorMsgType: msgType.msg })
}
// 修改密码
export function updatePassword(data) {
  return axios.post('/security/updatePassword', data, { errorMsgType: msgType.msg })
}
