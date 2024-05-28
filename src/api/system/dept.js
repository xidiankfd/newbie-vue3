import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/system/dept'

/**
 * 获取部门树
 * @param {*} params 筛选条件参数
 * @returns {Promise}
 */
export function getDeptTreeApi(params) {
  return axios.get(`${BASE_URL}/tree`, { params })
}

/**
 * 保存部门信息，有部门id则修改，否则新增
 * @param {*} data 部门数据
 * @returns {Promise}
 */
export function saveDeptApi(data) {
  if (data.id)
    return axios.post(`${BASE_URL}/update`, data, { successMsgType: msgType.msg })
  else
    return axios.post(`${BASE_URL}/add`, data, { successMsgType: msgType.msg })
}

/**
 * 批量删除
 * @param {*} deptIds 部门ID列表
 * @returns {Promise}
 */
export function deleteBatchApi(deptIds) {
  return axios.post(`${BASE_URL}/deleteBatch`, deptIds, { successMsgType: msgType.msg })
}
