import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/user'

/**
 * 获取用户分页数据
 * @param {Number} current 当前页
 * @param {Number} size 页大小
 * @param {Object} params 筛选条件参数
 * @returns {Promise}
 */
export function getUserPaging(current, size, params = {}) {
  return axios.get(`${BASE_URL}/page`, { params: { current, size, ...params } })
}

/**
 * 保存用户信息，有用户id则修改，否则新增
 * @param {Object} data 数据
 * @returns {Promise}
 */
export function saveUserApi(data) {
  if (data.id || data.id === 0)
    return axios.post(`${BASE_URL}/update`, data, { successMsgType: msgType.msg })

  else
    return axios.post(`${BASE_URL}/add`, data, { successMsgType: msgType.msg })
}

/**
 * 批量删除用户
 * @param {Array} ids id列表
 * @returns {Promise}
 */
export function deleteBatchApi(ids) {
  return axios.post(`${BASE_URL}/deleteBatch`, ids, { successMsgType: msgType.msg })
}

/**
 * 修改用户密码
 * @param {Number} userId
 * @param {String} newPassword
 * @param {String} confirmNewPassword
 * @returns {Promise}
 */
export function updateUserPassword(userId, newPassword, confirmNewPassword) {
  const data = {
    userId,
    newPassword,
    confirmNewPassword,
  }
  return axios.put(`${BASE_URL}/updateUserPassword`, data, { successMsgType: msgType.msg })
}

/**
 * 根据角色id查询已分配用户
 * @param {Number} current 当前页
 * @param {Number} size 页大小
 * @param {Number} roleId 角色ID
 * @param {Object} params 其它参数
 * @returns {Promise}
 */
export function queryUserByRoleIdApi(current, size, roleId, params) {
  return axios.get(`${BASE_URL}/queryUserByRoleId/${roleId}`, { params: { current, size, ...params } })
}

/**
 * 根据角色id查询未分配用户
 * @param {Number} current 当前页
 * @param {Number} size 页大小
 * @param {Number} roleId 角色ID
 * @param {Object} params 其它参数
 * @returns {Promise}
 */
export function queryUnUserByRoleIdApi(current, size, roleId, params) {
  return axios.get(`${BASE_URL}/queryUnUserByRoleId/${roleId}`, { params: { current, size, ...params } })
}
