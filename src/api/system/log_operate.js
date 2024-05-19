import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/log/operate'

/**
 * 获取操作日志分页数据
 * @param {*} params
 * @returns
 */
export function logOperatepagingApi(params) {
  return axios.get(`${BASE_URL}/paging`, { params })
}

/**
 * 批量删除操作日志
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
