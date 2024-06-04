import axios from '@/utils/axios'

const BASE_URL = '/monitor/server'

/**
 * 获取系统服务器信息
 * @returns
 */
export function getServerInfoApi() {
  return axios.get(BASE_URL, { timeout: 1000 * 60 * 5 })
}
