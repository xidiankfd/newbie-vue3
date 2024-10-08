import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/generator'

/**
 * 查询数据列表
 * @param {*} params 筛选条件参数
 * @returns {Promise}
 */
export function listApi(params) {
  return axios.get(`${BASE_URL}/dbTableList`, { params })
}

export function generateApi(data){
    return axios.post(`${BASE_URL}/generate`, data,{responseType: 'blob',})
}
