import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/role'

/**
 * 获取分页角色数据
 * @param {*} params 筛选条件参数
 * @returns
 */
export function getRolePaging(params) {
  return axios.get(`${BASE_URL}/page`, { params })
}

/**
 * 保存角色信息，有角色id则修改，否则新增
 * @param {*} data 角色信息数据
 * @returns {Promise}
 */
export function saveRoleApi(data) {
  if (data.roleId || data.roleId === 0)
    return axios.put(`${BASE_URL}/update`, data, { successMsgType: msgType.msg })
  else
    return axios.post(`${BASE_URL}/add`, data, { successMsgType: msgType.msg })
}

/**
 * 删除角色
 * @param {*} id 角色ID
 * @returns {Promise}
 */
export function deleteRoleApi(id) {
  return axios.delete(`${BASE_URL}/${id}`, { successMsgType: msgType.msg })
}
