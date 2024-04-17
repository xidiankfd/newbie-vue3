import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/dict/data'

/**
 * 分页获取字典数据
 * @param {*} current 当前页
 * @param {*} size 页大小
 * @param {*} params 筛选条件参数
 * @returns {Promise}
 */
export function getDictDataPagingApi(current, size, params) {
  params = { current, size, ...params }
  return axios.get(`${BASE_URL}/page`, { params })
}

/**
 * 保存字典数据,有id则修改，否则新增
 * @param {*} data 字典数据
 * @returns {Promise}
 */
export function saveDictDataApi(data) {
  if (data.id || data.id === 0)
    return axios.post(`${BASE_URL}/update`, data, { successMsgType: msgType.msg })
  else
    return axios.post(`${BASE_URL}/add`, data, { successMsgType: msgType.msg })
}

/**
 * 删除字典数据
 * @param {*} id 字典数据ID
 * @returns {Promise}
 */
export function deleteApi(ids) {
  return axios.post(`${BASE_URL}/delete`, ids, { successMsgType: msgType.msg })
}

/**
 * 修改为默认字典数据
 * @param {*} id 字典数据ID
 * @returns {Promise}
 */
export function updateDictDataAsDefaultApi(id) {
  return axios.post(`${BASE_URL}/updateDictDataAsDefault/${id}`, null, { successMsgType: msgType.msg })
}

/**
 * 根据分类ID查询字典数据列表
 * @param {*} typeCode 字典分类编码
 * @returns {Promise}
 */
export function getDictDataListByTypeCodeApi(typeCode) {
  return axios.get(`${BASE_URL}/getDictDataListByTypeCode/${typeCode}`)
}
