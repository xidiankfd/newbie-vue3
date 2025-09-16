/**
 * 标准资源模块Mock数据
 * 用于前端测试，模拟后端API响应
 */

// 模拟字典数据
export const mockDictData = {
  standardTypes: [
    { label: '国家标准', value: 'GB/T' },
    { label: '行业标准', value: 'WS/T' },
    { label: '地方标准', value: 'DB' },
    { label: '团体标准', value: 'T/' },
    { label: '规范性文件', value: 'OTHER' }
  ],

  standardStatuses: [
    { label: '现行', value: '现行' },
    { label: '废止', value: '废止' },
    { label: '即将实施', value: '即将实施' }
  ],

  standardFields: [
    { label: '医疗', value: '医疗' },
    { label: '医保', value: '医保' },
    { label: '公卫', value: '公卫' },
    { label: '医养', value: '医养' },
    { label: '其他', value: '其他' }
  ],

  standardNatures: [
    { label: '强制性', value: '强制性' },
    { label: '推荐性', value: '推荐性' },
    { label: '指导性技术文件', value: '指导性技术文件' }
  ],

  standardClassifications: [
    { label: '标准体系', value: '标准体系' },
    { label: '数据元', value: '数据元' },
    { label: '分类与编码', value: '分类与编码' },
    { label: '数据集', value: '数据集' },
    { label: '接口规范', value: '接口规范' },
    { label: '信息安全规范', value: '信息安全规范' },
    { label: '其他', value: '其他' }
  ],

  publishOrganizations: [
    { label: '国家卫生健康委员会', value: '国家卫生健康委员会' },
    { label: '国家医疗保障局', value: '国家医疗保障局' },
    { label: '国家药品监督管理局', value: '国家药品监督管理局' },
    { label: '中国医院协会', value: '中国医院协会' }
  ]
}

// 模拟标准资源列表数据
export const mockStandardResources = [
  {
    id: 1,
    resourceCode: 'GB/T 14396-2016',
    resourceName: '疾病分类与代码',
    standardType: '国家标准',
    standardNature: '推荐性',
    standardStatus: '现行',
    standardField: '医疗',
    standardClassification: '分类与编码',
    standardScope: '本标准规定了疾病、损伤和中毒及其外部原因，与保健机构接触的非医疗理由和肿瘤形态学的分类与代码。本标准适用于医疗卫生服务、医疗保障、人口管理等部门中对疾病，伤病等分类，并用信息处理与交换、统计分析。',
    publishOrg: '国家卫生健康委员会',
    updateTime: '2024-07-30',
    createTime: '2019-07-26',
    keywords: '疾病分类，互联互通测评，数据上报，数据交换'
  },
  {
    id: 2,
    resourceCode: 'T/CHIA 001-2017',
    resourceName: '手术、操作分类与代码',
    standardType: '团体标准',
    standardNature: '推荐性',
    standardStatus: '现行',
    standardField: '医疗',
    standardClassification: '分类与编码',
    standardScope: '本标准规定了手术、操作的分类与代码。本标准适用于医疗卫生服务、医疗保障、公安、民政等领域，为医疗机构出院患者的手术、操作数据分类，并用信息处理与交换、统计分析。',
    publishOrg: '中国医院协会',
    updateTime: '2024-07-30',
    createTime: '2019-07-26',
    keywords: '手术操作分类，互联互通测评，数据上报，数据交换'
  },
  {
    id: 3,
    resourceCode: 'WS 446-2014',
    resourceName: '居民健康档案医学检验项目常用代码',
    standardType: '行业标准',
    standardNature: '强制性',
    standardStatus: '现行',
    standardField: '医疗',
    standardClassification: '数据元',
    standardScope: '本标准依据医学检验项目的检测物（成分）及其他相关性，规定了我国居民健康档案中的医学检验项目常用代码。',
    publishOrg: '国家卫生健康委员会',
    updateTime: '2024-06-20',
    createTime: '2019-08-15',
    keywords: '健康档案，医学检验，代码'
  },
  {
    id: 4,
    resourceCode: 'GB/T 17538.1-2009',
    resourceName: '医疗保健产品灭菌 湿热',
    standardType: '国家标准',
    standardNature: '推荐性',
    standardStatus: '现行',
    standardField: '医疗',
    standardClassification: '其他',
    standardScope: '本标准规定了以湿热作为灭菌剂的灭菌过程开发、确认和常规控制方面的要求。',
    publishOrg: '国家药品监督管理局',
    updateTime: '2023-12-15',
    createTime: '2009-05-01',
    keywords: '医疗保健，产品灭菌，湿热'
  },
  {
    id: 5,
    resourceCode: 'DB11/T 1482-2017',
    resourceName: '医疗机构药学部门设置与管理规范',
    standardType: '地方标准',
    standardNature: '推荐性',
    standardStatus: '现行',
    standardField: '医疗',
    standardClassification: '标准体系',
    standardScope: '本标准规定了医疗机构药学部门的设置原则、组织架构、人员配置、设施设备配置和管理要求。',
    publishOrg: '国家卫生健康委员会',
    updateTime: '2024-01-10',
    createTime: '2017-08-01',
    keywords: '医疗机构，药学部门，设置管理'
  }
]

// 生成分页响应数据
export function generatePageResponse(data, current = 1, size = 10, searchParams = {}) {
  let filteredData = [...data]

  // 简单的搜索过滤
  if (searchParams.keyword) {
    const keyword = searchParams.keyword.toLowerCase()
    filteredData = filteredData.filter(item =>
      item.resourceCode.toLowerCase().includes(keyword) ||
      item.resourceName.toLowerCase().includes(keyword) ||
      item.keywords.toLowerCase().includes(keyword)
    )
  }

  // 按字段过滤
  ['standardType', 'standardStatus', 'standardField', 'standardNature', 'standardClassification'].forEach(field => {
    if (searchParams[field] && searchParams[field] !== '') {
      // 支持逗号分隔的多选和数组
      let values = []
      if (Array.isArray(searchParams[field])) {
        values = searchParams[field].filter(v => v && v.trim && v.trim())
      } else if (typeof searchParams[field] === 'string') {
        values = searchParams[field].split(',').filter(v => v.trim())
      }

      if (values.length > 0) {
        filteredData = filteredData.filter(item => values.includes(item[field]))
      }
    }
  })

  const total = filteredData.length
  const startIndex = (current - 1) * size
  const endIndex = startIndex + size
  const records = filteredData.slice(startIndex, endIndex)

  return {
    code: 200,
    success: true,
    msg: '查询成功',
    data: {
      records,
      total,
      current,
      size,
      pages: Math.ceil(total / size)
    }
  }
}

// 模拟API响应
export function mockApiResponse(data, msg = '操作成功') {
  return {
    code: 200,
    success: true,
    msg,
    data
  }
}

export default {
  mockDictData,
  mockStandardResources,
  generatePageResponse,
  mockApiResponse
}