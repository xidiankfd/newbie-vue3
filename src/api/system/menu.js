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
 * @param {*} successInfo 是否回显成功消息提示
 * @returns {Promise}
 */
export function saveMenuApi(data, successInfo = true) {
  if (data.menuId || data.menuId === 0)
    return axios.put(`${BASE_URL}/update`, data, { successMsgType: successInfo ? msgType.msg : msgType.none })
  else
    return axios.post(`${BASE_URL}/add`, data, { successMsgType: successInfo ? msgType.msg : msgType.none })
}

/**
 * 根据菜单id列表批量删除菜单数据并删除角色权限关系
 * @param {*} menuIds 菜单id列表
 * @param {*} successInfo 是否回显成功消息提示
 * @returns {Promise}
 */
export function deleteMenuBatchApi(menuIds, successInfo = true) {
  const params = {
    ids: menuIds.join(),
  }
  return axios.delete(`${BASE_URL}/delete`, { params, successMsgType: successInfo ? msgType.msg : msgType.none })
}
