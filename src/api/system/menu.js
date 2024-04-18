import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/menu'
/**
 * 获取菜单树
 * @param {*} params 筛选条件参数
 * @returns {Promise}
 */
export function getMenuTreeApi(params) {
  return axios.get(`${BASE_URL}/tree`, { params })
}

/**
 * 保存菜单信息，有菜单id则修改，否则新增
 * @param {*} data 菜单数据
 * @returns {Promise}
 */
export function saveMenuApi(data) {
  if (data.id || data.id === 0)
    return axios.post(`${BASE_URL}/update`, data, { successMsgType: msgType.msg })
  else
    return axios.post(`${BASE_URL}/add`, data, { successMsgType: msgType.msg })
}

/**
 * 批量删除
 * @param {*} menuIds 菜单id列表
 * @returns {Promise}
 */
export function deleteBatchApi(menuIds) {
  return axios.post(`${BASE_URL}/deleteBatch`, menuIds, { successMsgType: msgType.msg })
}
