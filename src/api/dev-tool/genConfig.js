import axios, { msgType } from '@/utils/axios'

const BASE_URL = '/generator/genConfig'

/**
* 分页查询数据列表
*/
export function pageApi(params) {
  return axios.get(`${BASE_URL}/page`, { params })
}

/**
* 查询数据列表
*/
export function listApi(params) {
  return axios.get(`${BASE_URL}/list`, { params })
}

/**
* 新增数据
*/
export function addDataApi(data){
  return axios.post(`${BASE_URL}/addData`, data, { successMsgType: msgType.msg })
}

/**
* 根据主键更新数据
*/
export function updateByPkValApi(data){
  return axios.post(`${BASE_URL}/updateByPkVal`, data, { successMsgType: msgType.msg })
}

/**
* 保存数据信息，主键有值则修改，否则新增
*/
export function saveDeptApi(data) {
  if (data.id)
    return updateByPkValApi(data)
  else
    return addDataApi(data)
}

/**
* 根据主键删除数据
*/
export function deleteByPkValApi(id) {
  return axios.post(`${BASE_URL}/deleteByPkVal/${id}`, null, { successMsgType: msgType.msg })
}
