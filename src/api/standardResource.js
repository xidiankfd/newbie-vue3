import request from '@/utils/axios'

const baseURL = '/api/standard'

/**
 * 标准资源API接口
 */
export const standardResourceApi = {
  /**
   * 获取标准资源列表
   * @param {Object} params - 查询参数
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.standardType - 标准类型
   * @param {string} params.status - 标准状态
   * @param {string} params.domain - 标准领域
   * @param {number} params.pageNum - 当前页码
   * @param {number} params.pageSize - 每页条数
   * @returns {Promise}
   */
  getStandardList: (params) => {
    return request({
      url: `${baseURL}/list`,
      method: 'get',
      params,
    })
  },

  /**
   * 获取标准资源详情
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  getStandardDetail: (id) => {
    return request({
      url: `${baseURL}/detail/${id}`,
      method: 'get',
    })
  },

  /**
   * 获取标准数字化内容
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  getDigitalContent: (id) => {
    return request({
      url: `${baseURL}/digitalContent/${id}`,
      method: 'get',
    })
  },

  /**
   * 获取标准应用支持信息
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  getApplicationSupport: (id) => {
    return request({
      url: `${baseURL}/applicationSupport/${id}`,
      method: 'get',
    })
  },

  /**
   * 搜索标准资源
   * @param {Object} params - 搜索参数
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.standardType - 标准类型
   * @param {string} params.status - 标准状态
   * @param {string} params.domain - 标准领域
   * @param {number} params.pageNum - 当前页码
   * @param {number} params.pageSize - 每页条数
   * @returns {Promise}
   */
  searchStandards: (params) => {
    return request({
      url: `${baseURL}/search`,
      method: 'get',
      params,
    })
  },

  /**
   * 获取标准分类选项
   * @returns {Promise}
   */
  getStandardCategories: () => {
    return request({
      url: `${baseURL}/categories`,
      method: 'get',
    })
  },

  /**
   * 获取标准领域选项
   * @returns {Promise}
   */
  getStandardDomains: () => {
    return request({
      url: `${baseURL}/domains`,
      method: 'get',
    })
  },

  /**
   * 获取标准状态选项
   * @returns {Promise}
   */
  getStandardStatuses: () => {
    return request({
      url: `${baseURL}/statuses`,
      method: 'get',
    })
  },

  /**
   * 获取标准性质选项
   * @returns {Promise}
   */
  getStandardNatures: () => {
    return request({
      url: `${baseURL}/natures`,
      method: 'get',
    })
  },

  /**
   * 获取发布机构选项
   * @returns {Promise}
   */
  getPublishingOrganizations: () => {
    return request({
      url: `${baseURL}/organizations`,
      method: 'get',
    })
  },

  /**
   * 下载标准数字化文件
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  downloadDigitalFile: (id) => {
    return request({
      url: `${baseURL}/download/${id}`,
      method: 'get',
      responseType: 'blob',
    })
  },

  /**
   * 获取API接口列表
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  getApiList: (id) => {
    return request({
      url: `${baseURL}/apis/${id}`,
      method: 'get',
    })
  },

  /**
   * 获取SDK工具列表
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  getSdkList: (id) => {
    return request({
      url: `${baseURL}/sdks/${id}`,
      method: 'get',
    })
  },

  /**
   * 获取使用示例代码
   * @param {string} id - 标准ID
   * @param {string} language - 编程语言
   * @returns {Promise}
   */
  getExampleCode: (id, language) => {
    return request({
      url: `${baseURL}/examples/${id}`,
      method: 'get',
      params: { language },
    })
  },

  /**
   * 获取常见问题
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  getFaqs: (id) => {
    return request({
      url: `${baseURL}/faqs/${id}`,
      method: 'get',
    })
  },

  /**
   * 获取应用场景
   * @param {string} id - 标准ID
   * @returns {Promise}
   */
  getApplicationScenarios: (id) => {
    return request({
      url: `${baseURL}/scenarios/${id}`,
      method: 'get',
    })
  },
}

export default standardResourceApi
