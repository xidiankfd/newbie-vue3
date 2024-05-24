import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/log/login'

/**
 * 获取登录日志分页数据
 * @param {*} params
 * @returns
 */
export function logLoginPagingApi(params) {
  return axios.get(`${BASE_URL}/paging`, { params })
}
/**
 * 根据当前用户获取登录日志分页数据
 * @param {*} params
 * @returns
 */
export function pagingByCurrUserApi(params) {
  return axios.get(`${BASE_URL}/pagingByCurrUser`, { params })
}

/**
 * 批量删除登录日志
 * @param {*} ids
 * @returns
 */
export function deleteBatchApi(ids) {
  return axios.post(`${BASE_URL}/deleteBatch`, ids, { successMsgType: msgType.msg })
}

/**
 * 清除i天前数据
 * @returns
 */
export function deleteBeforeDataApi(i) {
  const params = { i }
  return axios.get(`${BASE_URL}/deleteBeforeData`, { params, successMsgType: msgType.msg })
}
