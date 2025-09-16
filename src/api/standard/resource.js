import request from '@/utils/axios'
import { mockDictData, mockStandardResources, generatePageResponse, mockApiResponse } from '@/mock/standardResource'

const baseURL = '/standard'

// 通过环境变量控制是否使用Mock数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

/**
 * 标准资源核心API接口
 * 对应后端 StdResourceController
 */
export const stdResourceApi = {
  /**
   * 分页查询标准资源列表 (支持多维度筛选)
   * @param {Object} params - 查询参数
   * @param {number} params.current - 当前页码 (从1开始)
   * @param {number} params.size - 每页大小 (默认10)
   * @param {string} params.resourceCode - 标准编号模糊查询
   * @param {string} params.resourceName - 标准名称模糊查询
   * @param {string} params.standardStatus - 标准状态 (现行/废止/即将实施)
   * @param {string} params.standardField - 标准领域
   * @param {string} params.standardType - 标准类型 (GB/T/WS/T/DB等)
   * @param {string} params.publishOrg - 发布机构
   * @param {string} params.standardNature - 标准性质 (强制性/推荐性)
   * @param {string} params.standardClassification - 标准分类
   * @returns {Promise}
   */
  getResourcePage: async (params) => {
    if (USE_MOCK) {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      return generatePageResponse(mockStandardResources, params.current, params.size, params)
    }

    return request({
      url: `${baseURL}/resource/page`,
      method: 'get',
      params,
    })
  },

  /**
   * 获取标准资源详情
   * @param {string|number} id - 标准资源ID
   * @returns {Promise}
   */
  getResourceDetail: (id) => {
    return request({
      url: `${baseURL}/resource/${id}`,
      method: 'get',
    })
  },

  /**
   * 按编号精确查询标准资源
   * @param {string} code - 标准编号
   * @returns {Promise}
   */
  getResourceByCode: (code) => {
    return request({
      url: `${baseURL}/resource/code/${code}`,
      method: 'get',
    })
  },

  /**
   * 按状态查询标准资源
   * @param {string} status - 标准状态 (现行/废止/即将实施)
   * @param {Object} params - 其他查询参数
   * @returns {Promise}
   */
  getResourceByStatus: (status, params = {}) => {
    return request({
      url: `${baseURL}/resource/status/${status}`,
      method: 'get',
      params,
    })
  },

  /**
   * 按领域查询标准资源
   * @param {string} field - 标准领域
   * @param {Object} params - 其他查询参数
   * @returns {Promise}
   */
  getResourceByField: (field, params = {}) => {
    return request({
      url: `${baseURL}/resource/field/${field}`,
      method: 'get',
      params,
    })
  },

  /**
   * 新增标准资源
   * @param {Object} data - 标准资源数据
   * @returns {Promise}
   */
  addResource: (data) => {
    return request({
      url: `${baseURL}/resource`,
      method: 'post',
      data,
    })
  },

  /**
   * 更新标准资源
   * @param {Object} data - 标准资源数据
   * @returns {Promise}
   */
  updateResource: (data) => {
    return request({
      url: `${baseURL}/resource`,
      method: 'put',
      data,
    })
  },

  /**
   * 批量删除标准资源
   * @param {Array} ids - 资源ID数组
   * @returns {Promise}
   */
  deleteResources: (ids) => {
    return request({
      url: `${baseURL}/resource/${ids.join(',')}`,
      method: 'delete',
    })
  },

  /**
   * 批量导入标准资源
   * @param {Object} data - 批量导入数据
   * @returns {Promise}
   */
  batchImportResources: (data) => {
    return request({
      url: `${baseURL}/resource/batch`,
      method: 'post',
      data,
    })
  },
}

/**
 * 标准资源附件API接口
 * 对应后端 StdResourceAttachmentController
 */
export const stdAttachmentApi = {
  /**
   * 分页查询附件列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getAttachmentPage: (params) => {
    return request({
      url: `${baseURL}/attachment/page`,
      method: 'get',
      params,
    })
  },

  /**
   * 获取指定资源的所有附件
   * @param {string|number} resourceId - 资源ID
   * @returns {Promise}
   */
  getAttachmentsByResource: (resourceId) => {
    return request({
      url: `${baseURL}/attachment/resource/${resourceId}`,
      method: 'get',
    })
  },

  /**
   * 新增附件
   * @param {Object} data - 附件数据
   * @returns {Promise}
   */
  addAttachment: (data) => {
    return request({
      url: `${baseURL}/attachment`,
      method: 'post',
      data,
    })
  },

  /**
   * 更新附件信息
   * @param {Object} data - 附件数据
   * @returns {Promise}
   */
  updateAttachment: (data) => {
    return request({
      url: `${baseURL}/attachment`,
      method: 'put',
      data,
    })
  },

  /**
   * 批量删除附件
   * @param {Array} ids - 附件ID数组
   * @returns {Promise}
   */
  deleteAttachments: (ids) => {
    return request({
      url: `${baseURL}/attachment/${ids.join(',')}`,
      method: 'delete',
    })
  },

  /**
   * 下载附件
   * @param {string|number} id - 附件ID
   * @returns {Promise}
   */
  downloadAttachment: (id) => {
    return request({
      url: `${baseURL}/attachment/download/${id}`,
      method: 'get',
      responseType: 'blob',
    })
  },
}

/**
 * 标准资源引用关系API接口
 * 对应后端 StdResourceReferenceController
 */
export const stdReferenceApi = {
  /**
   * 分页查询引用关系
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getReferencePage: (params) => {
    return request({
      url: `${baseURL}/reference/page`,
      method: 'get',
      params,
    })
  },

  /**
   * 获取源标准的引用关系
   * @param {string|number} resourceId - 资源ID
   * @returns {Promise}
   */
  getSourceReferences: (resourceId) => {
    return request({
      url: `${baseURL}/reference/source/${resourceId}`,
      method: 'get',
    })
  },

  /**
   * 获取目标标准的被引用关系
   * @param {string|number} resourceId - 资源ID
   * @returns {Promise}
   */
  getTargetReferences: (resourceId) => {
    return request({
      url: `${baseURL}/reference/target/${resourceId}`,
      method: 'get',
    })
  },

  /**
   * 新增引用关系
   * @param {Object} data - 引用关系数据
   * @returns {Promise}
   */
  addReference: (data) => {
    return request({
      url: `${baseURL}/reference`,
      method: 'post',
      data,
    })
  },

  /**
   * 更新引用关系
   * @param {Object} data - 引用关系数据
   * @returns {Promise}
   */
  updateReference: (data) => {
    return request({
      url: `${baseURL}/reference`,
      method: 'put',
      data,
    })
  },

  /**
   * 删除引用关系
   * @param {Array} ids - 关系ID数组
   * @returns {Promise}
   */
  deleteReferences: (ids) => {
    return request({
      url: `${baseURL}/reference/${ids.join(',')}`,
      method: 'delete',
    })
  },
}

/**
 * 标准术语管理API接口
 * 对应后端 StdTerminologyController
 */
export const stdTerminologyApi = {
  /**
   * 分页查询术语列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getTerminologyPage: (params) => {
    return request({
      url: `${baseURL}/terminology/page`,
      method: 'get',
      params,
    })
  },

  /**
   * 按分类查询术语
   * @param {string} category - 术语分类
   * @param {Object} params - 其他查询参数
   * @returns {Promise}
   */
  getTerminologyByCategory: (category, params = {}) => {
    return request({
      url: `${baseURL}/terminology/category/${category}`,
      method: 'get',
      params,
    })
  },

  /**
   * 术语搜索 (支持拼音、关键词)
   * @param {Object} params - 搜索参数
   * @returns {Promise}
   */
  searchTerminology: (params) => {
    return request({
      url: `${baseURL}/terminology/search`,
      method: 'get',
      params,
    })
  },

  /**
   * 新增术语
   * @param {Object} data - 术语数据
   * @returns {Promise}
   */
  addTerminology: (data) => {
    return request({
      url: `${baseURL}/terminology`,
      method: 'post',
      data,
    })
  },

  /**
   * 更新术语
   * @param {Object} data - 术语数据
   * @returns {Promise}
   */
  updateTerminology: (data) => {
    return request({
      url: `${baseURL}/terminology`,
      method: 'put',
      data,
    })
  },

  /**
   * 批量删除术语
   * @param {Array} ids - 术语ID数组
   * @returns {Promise}
   */
  deleteTerminologies: (ids) => {
    return request({
      url: `${baseURL}/terminology/${ids.join(',')}`,
      method: 'delete',
    })
  },
}

/**
 * 标准解读说明API接口
 * 对应后端 StdInterpretationController
 */
export const stdInterpretationApi = {
  /**
   * 分页查询解读列表
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getInterpretationPage: (params) => {
    return request({
      url: `${baseURL}/interpretation/page`,
      method: 'get',
      params,
    })
  },

  /**
   * 获取指定标准的解读
   * @param {string|number} resourceId - 资源ID
   * @returns {Promise}
   */
  getInterpretationsByResource: (resourceId) => {
    return request({
      url: `${baseURL}/interpretation/resource/${resourceId}`,
      method: 'get',
    })
  },

  /**
   * 获取官方解读
   * @param {Object} params - 查询参数
   * @returns {Promise}
   */
  getOfficialInterpretations: (params = {}) => {
    return request({
      url: `${baseURL}/interpretation/official`,
      method: 'get',
      params,
    })
  },

  /**
   * 新增解读
   * @param {Object} data - 解读数据
   * @returns {Promise}
   */
  addInterpretation: (data) => {
    return request({
      url: `${baseURL}/interpretation`,
      method: 'post',
      data,
    })
  },

  /**
   * 更新解读
   * @param {Object} data - 解读数据
   * @returns {Promise}
   */
  updateInterpretation: (data) => {
    return request({
      url: `${baseURL}/interpretation`,
      method: 'put',
      data,
    })
  },

  /**
   * 删除解读
   * @param {Array} ids - 解读ID数组
   * @returns {Promise}
   */
  deleteInterpretations: (ids) => {
    return request({
      url: `${baseURL}/interpretation/${ids.join(',')}`,
      method: 'delete',
    })
  },
}

/**
 * 标准资源字典数据API接口
 * 使用系统字典模块获取下拉选项数据
 */
export const stdDictApi = {
  /**
   * 获取标准类型选项（Mock数据，字典表中暂无此类型）
   * @returns {Promise}
   */
  getStandardTypes: async () => {
    // 目前字典表无此类型，使用Mock数据
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockApiResponse(mockDictData.standardTypes)
  },

  /**
   * 获取标准状态选项
   * @returns {Promise}
   */
  getStandardStatuses: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockApiResponse(mockDictData.standardStatuses)
    }

    return request({
      url: '/system/dict/data/getDictDataListByTypeCode/std_status',
      method: 'get',
    })
  },

  /**
   * 获取标准领域选项
   * @returns {Promise}
   */
  getStandardFields: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200))
      return mockApiResponse(mockDictData.standardFields)
    }

    return request({
      url: '/system/dict/data/getDictDataListByTypeCode/std_field',
      method: 'get',
    })
  },

  /**
   * 获取标准性质选项（Mock数据，字典表中暂无此类型）
   * @returns {Promise}
   */
  getStandardNatures: async () => {
    // 目前字典表无此类型，使用Mock数据
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockApiResponse(mockDictData.standardNatures)
  },

  /**
   * 获取标准分类选项（Mock数据，字典表中暂无此类型）
   * @returns {Promise}
   */
  getStandardClassifications: async () => {
    // 目前字典表无此类型，使用Mock数据
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockApiResponse(mockDictData.standardClassifications)
  },

  /**
   * 获取发布机构选项（Mock数据，字典表中暂无此类型）
   * @returns {Promise}
   */
  getPublishOrganizations: async () => {
    // 目前字典表无此类型，使用Mock数据
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockApiResponse(mockDictData.publishOrganizations)
  },
}

// 默认导出主要API
export default {
  resource: stdResourceApi,
  attachment: stdAttachmentApi,
  reference: stdReferenceApi,
  terminology: stdTerminologyApi,
  interpretation: stdInterpretationApi,
  dict: stdDictApi,
}
