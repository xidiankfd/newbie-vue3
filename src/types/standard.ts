/**
 * 标准资源模块数据类型定义
 * 用于TypeScript类型检查和接口参数验证
 */

// 标准资源主体数据结构
export interface StdResource {
  id?: number
  resourceCode: string // 标准编号 (必填)
  resourceName: string // 标准名称 (必填)
  resourceNameEn?: string // 英文名称
  standardType: string // 标准类型 (GB/T、WS/T、DB等)
  standardNature: string // 标准性质 (强制性/推荐性)
  standardStatus: string // 标准状态 (现行/废止/即将实施)
  standardField: string // 标准领域 (医疗/医保/公卫等)
  standardClassification: string // 标准分类
  standardScope?: string // 适用范围
  publishOrg?: string // 发布机构
  publishTime?: string // 发布时间
  effectiveTime?: string // 生效时间
  updateTime?: string // 更新时间
  keywords?: string // 关键词
  description?: string // 描述
  remark?: string // 备注
  attachmentCount?: number // 附件数量
  referenceCount?: number // 引用关系数量
  interpretationCount?: number // 解读数量
  terminologyCount?: number // 术语数量
  isDeleted?: number // 逻辑删除标识
  createTime?: string // 创建时间
  creator?: string // 创建人
  updater?: string // 更新人
}

// 标准资源附件数据结构
export interface StdResourceAttachment {
  id?: number
  resourceId: number // 关联的资源ID
  attachmentName: string // 附件名称
  attachmentType: string // 附件类型 (主附件/辅助附件)
  fileType: string // 文件类型 (PDF/DOCX/XLS等)
  fileSize?: number // 文件大小 (字节)
  filePath: string // 文件路径
  downloadUrl?: string // 下载链接
  uploadTime?: string // 上传时间
  description?: string // 描述
  sortOrder?: number // 排序序号
  isDeleted?: number // 逻辑删除标识
  createTime?: string // 创建时间
  creator?: string // 创建人
}

// 标准资源引用关系数据结构
export interface StdResourceReference {
  id?: number
  sourceResourceId: number // 源资源ID
  targetResourceId: number // 目标资源ID
  referenceType: string // 关系类型 (替代/引用/参考)
  referenceDesc?: string // 关系描述
  effectiveTime?: string // 生效时间
  isDeleted?: number // 逻辑删除标识
  createTime?: string // 创建时间
  creator?: string // 创建人
}

// 标准术语数据结构
export interface StdTerminology {
  id?: number
  terminologyName: string // 术语名称
  terminologyNameEn?: string // 英文名称
  terminologyDef: string // 术语定义
  terminologyDefEn?: string // 英文定义
  terminologyCategory: string // 术语分类
  applicableScope?: string // 适用范围
  relatedStandards?: string // 关联标准
  synonyms?: string // 同义词
  pinyin?: string // 拼音
  sortOrder?: number // 排序序号
  isDeleted?: number // 逻辑删除标识
  createTime?: string // 创建时间
  creator?: string // 创建人
}

// 标准解读数据结构
export interface StdInterpretation {
  id?: number
  resourceId: number // 关联的资源ID
  interpretationTitle: string // 解读标题
  interpretationContent: string // 解读内容
  interpretationSource: string // 解读来源
  isOfficial: number // 是否官方解读 (0/1)
  authorName?: string // 作者姓名
  authorOrg?: string // 作者机构
  publishTime?: string // 发布时间
  viewCount?: number // 浏览次数
  sortOrder?: number // 排序序号
  isDeleted?: number // 逻辑删除标识
  createTime?: string // 创建时间
  creator?: string // 创建人
}

// 字典选项数据结构
export interface DictOption {
  label: string // 显示文本
  value: string // 选项值
  description?: string // 描述
  sortOrder?: number // 排序序号
}

// 分页查询参数
export interface PageParams {
  current: number // 当前页码 (从1开始)
  size: number // 每页大小
}

// 分页响应数据
export interface PageResult<T> {
  records: T[] // 数据列表
  total: number // 总记录数
  current: number // 当前页
  size: number // 每页大小
  pages: number // 总页数
}

// API统一响应格式
export interface ApiResponse<T = any> {
  code: number // 状态码
  success: boolean // 是否成功
  msg: string // 响应消息
  data: T // 响应数据
}

// 标准资源查询参数
export interface StdResourceQuery extends PageParams {
  resourceCode?: string // 标准编号模糊查询
  resourceName?: string // 标准名称模糊查询
  standardType?: string // 标准类型
  standardNature?: string // 标准性质
  standardStatus?: string // 标准状态
  standardField?: string // 标准领域
  standardClassification?: string // 标准分类
  publishOrg?: string // 发布机构
  keyword?: string // 关键词搜索
  sortBy?: string // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// 标准资源筛选表单
export interface StdResourceFilter {
  standardNature: string[] // 标准性质 (多选)
  standardStatus: string[] // 标准状态 (多选)
  standardType: string[] // 标准类型 (多选)
  standardField: string[] // 标准领域 (多选)
  standardClassification: string[] // 标准分类 (多选)
  publishOrg: string // 发布机构 (单选)
}

// 标准资源搜索表单
export interface StdResourceSearch {
  keyword: string // 搜索关键词
  standardType: string // 标准类型
  standardStatus: string // 标准状态
  standardField: string // 标准领域
  sortBy: string // 排序方式
}

// 文件上传响应
export interface FileUploadResponse {
  fileId: string // 文件ID
  fileName: string // 文件名称
  fileSize: number // 文件大小
  fileType: string // 文件类型
  filePath: string // 文件路径
  downloadUrl: string // 下载链接
}

// 错误信息
export interface ErrorInfo {
  code: number // 错误码
  message: string // 错误消息
  field?: string // 错误字段
  details?: any // 详细信息
}

// 后端数据库字段映射到前端显示字段的映射关系
export const fieldMapping = {
  // 标准资源主表字段映射
  resource: {
    resource_code: 'resourceCode',
    resource_name: 'resourceName',
    resource_name_en: 'resourceNameEn',
    standard_type: 'standardType',
    standard_nature: 'standardNature',
    standard_status: 'standardStatus',
    standard_field: 'standardField',
    standard_classification: 'standardClassification',
    standard_scope: 'standardScope',
    publish_org: 'publishOrg',
    publish_time: 'publishTime',
    effective_time: 'effectiveTime',
    update_time: 'updateTime',
    create_time: 'createTime',
    is_deleted: 'isDeleted',
  },

  // 附件表字段映射
  attachment: {
    resource_id: 'resourceId',
    attachment_name: 'attachmentName',
    attachment_type: 'attachmentType',
    file_type: 'fileType',
    file_size: 'fileSize',
    file_path: 'filePath',
    download_url: 'downloadUrl',
    upload_time: 'uploadTime',
    sort_order: 'sortOrder',
  },

  // 引用关系表字段映射
  reference: {
    source_resource_id: 'sourceResourceId',
    target_resource_id: 'targetResourceId',
    reference_type: 'referenceType',
    reference_desc: 'referenceDesc',
    effective_time: 'effectiveTime',
  },

  // 术语表字段映射
  terminology: {
    terminology_name: 'terminologyName',
    terminology_name_en: 'terminologyNameEn',
    terminology_def: 'terminologyDef',
    terminology_def_en: 'terminologyDefEn',
    terminology_category: 'terminologyCategory',
    applicable_scope: 'applicableScope',
    related_standards: 'relatedStandards',
    sort_order: 'sortOrder',
  },

  // 解读表字段映射
  interpretation: {
    resource_id: 'resourceId',
    interpretation_title: 'interpretationTitle',
    interpretation_content: 'interpretationContent',
    interpretation_source: 'interpretationSource',
    is_official: 'isOfficial',
    author_name: 'authorName',
    author_org: 'authorOrg',
    publish_time: 'publishTime',
    view_count: 'viewCount',
    sort_order: 'sortOrder',
  },
}

// 验证规则
export const validationRules = {
  // 标准资源验证规则
  stdResource: {
    resourceCode: [
      { required: true, message: '请输入标准编号', trigger: 'blur' },
      { max: 50, message: '标准编号不能超过50个字符', trigger: 'blur' },
    ],
    resourceName: [
      { required: true, message: '请输入标准名称', trigger: 'blur' },
      { max: 200, message: '标准名称不能超过200个字符', trigger: 'blur' },
    ],
    standardType: [
      { required: true, message: '请选择标准类型', trigger: 'change' },
    ],
    standardNature: [
      { required: true, message: '请选择标准性质', trigger: 'change' },
    ],
    standardStatus: [
      { required: true, message: '请选择标准状态', trigger: 'change' },
    ],
    standardField: [
      { required: true, message: '请选择标准领域', trigger: 'change' },
    ],
  },

  // 附件验证规则
  stdAttachment: {
    attachmentName: [
      { required: true, message: '请输入附件名称', trigger: 'blur' },
      { max: 100, message: '附件名称不能超过100个字符', trigger: 'blur' },
    ],
    attachmentType: [
      { required: true, message: '请选择附件类型', trigger: 'change' },
    ],
    filePath: [
      { required: true, message: '请上传文件', trigger: 'change' },
    ],
  },
}

export default {
  StdResource,
  StdResourceAttachment,
  StdResourceReference,
  StdTerminology,
  StdInterpretation,
  DictOption,
  PageParams,
  PageResult,
  ApiResponse,
  StdResourceQuery,
  StdResourceFilter,
  StdResourceSearch,
  FileUploadResponse,
  ErrorInfo,
  fieldMapping,
  validationRules,
}
