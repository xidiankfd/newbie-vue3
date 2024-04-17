import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/role_menu'

/**
 * 根据角色ID删除权限关系并重新保存权限关系
 * @param {*} roleId 角色ID
 * @param {*} menuIds 权限ID列表
 * @param {*} successInfo 是否回显成功提示
 * @returns {Promise}
 */
export function removeAndSaveByRoleId(roleId, menuIds, successInfo = true) {
  const data = {
    roleId,
    menuIds,
  }
  return axios.post(`${BASE_URL}/removeAndSaveByRoleId`, data, { successMsgType: successInfo ? msgType.msg : msgType.none })
}

/**
 * 根据角色ID获取权限关系列表
 * @param {Number} roleId 角色ID
 * @returns {Promise}
 */
export function listByRoleId(roleId) {
  return axios.get(`${BASE_URL}/listByRoleId`, { params: { roleId } })
}
