import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/user_role'

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

/**
 * 增量关联
 * @param {Array} userIds 用户ID数组
 * @param {Array} roleIds 角色ID数组
 * @param {Boolean} successInfo 是否回显成功提示
 * @returns {Promise}
 */
export function appendApi(userIds, roleIds, successInfo = true) {
  const data = {
    userIds,
    roleIds,
  }
  return axios.post(`${BASE_URL}/append`, data, { successMsgType: successInfo ? msgType.msg : msgType.none })
}
/**
 * 批量清楚关联
 * @param {Array} userIds 用户ID数组
 * @param {Array} roleIds 角色ID数组
 * @param {Boolean} successInfo 是否回显成功提示
 * @returns {Promise}
 */

export function cancelBatch(userIds, roleIds, successInfo = true) {
  const data = {
    userIds,
    roleIds,
  }
  return axios.post(`${BASE_URL}/cancelBatch`, data, { successMsgType: successInfo ? msgType.msg : msgType.none })
}
