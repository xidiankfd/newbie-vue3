<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { ElBacktop, ElButton, ElCard, ElCheckbox, ElCheckboxGroup, ElCol, ElForm, ElFormItem, ElInput, ElMessage, ElOption, ElPagination, ElRow, ElSelect, ElTag } from 'element-plus'
import { debounce } from 'lodash'
import { useRouter } from 'vue-router'
import standardApi from '@/api/standard/resource'

// 路由实例
const router = useRouter()

// 搜索条件状态
const searchForm = reactive({
  keyword: '',
  standardType: '全部',
  status: '全部',
  domain: '全部',
  searchField: '全部',
  sortBy: 'publishDate',
  sortOrder: 'DESC',
})

// 筛选条件状态
const filterForm = reactive({
  standardNature: [],
  standardStatus: [],
  standardType: [],
  standardDomain: [],
  standardClassification: [],
  applicableDomain: [],
  publishingOrganization: [],
  draftingOrganization: [],
  responsibleOrganization: '',
  ccs: '',
  ics: '',
  publishDateRange: [],
  implementDateRange: [],
  hasInterpretation: false,
  hasPatent: false,
})

// 加载状态
const loading = ref(false)

// 回到顶部可见性
const backtopVisible = ref(false)

// 表格数据
const tableData = ref([
  {
    id: 'WS/T 865-2025',
    standardNumber: 'WS/T 865-2025',
    name: '血站采供血基本数据集',
    type: '行业标准',
    nature: '推荐性',
    applicableScope: '本标准规定了血站采供血基本数据集的元数据属性和数据元属性。本标准适用于血站采供血基本信息的采集、存储与共享，以及血站信息系统的开发建设。',
    domain: '医疗',
    classification: '数据集',
    keywords: ['采供血', '血液中心', '血液管理', '血液质量控制', '基本数据'],
    hitaId: 'H01893',
    recordDate: '2025-07-23',
    updateDate: '2025-07-23',
    publishDate: '2025-06-20',
    status: '现行'
  },
  {
    id: 'WS/T 866-2025',
    standardNumber: 'WS/T 866-2025',
    name: '医疗机构临床用血基本数据集',
    type: '行业标准',
    nature: '推荐性',
    applicableScope: '本标准规定了医疗机构临床用血基本数据集的元数据属性和数据元属性。本标准适用于医疗机构临床用血信息的采集、存储与共享，以及临床用血信息系统开发建设。',
    domain: '医疗',
    classification: '数据集',
    keywords: ['临床用血', '医疗机构', '血液产品', '输血', '血液管理', '血液中心', '基本数据集'],
    hitaId: 'H01894',
    recordDate: '2025-07-23',
    updateDate: '2025-07-23',
    publishDate: '2025-06-18',
    status: '现行'
  },
  {
    id: 'GB/T 45938-2025',
    standardNumber: 'GB/T 45938-2025',
    name: '医疗保障信息平台 便民服务相关技术规范',
    type: '国家标准',
    nature: '推荐性',
    applicableScope: '本文件规定了医疗保障信息平台便民服务业务的接入方式、接入功能要求、性能要求和安全要求,并描述了证实方法。本文件适用于合作应用机构接入医疗保障信息平台便民服务业务。',
    domain: '医保',
    classification: '系统规范',
    keywords: ['医疗保障信息平台', '医保接入框架', '功能要求', '性能要求', '安全要求'],
    hitaId: 'H01902',
    recordDate: '2025-08-15',
    updateDate: '2025-08-15',
    publishDate: '2025-07-30',
    status: '现行'
  },
  {
    id: 'H01897',
    standardNumber: '',
    name: '医保药品分类与代码数据(西药、中成药)_截至2025年7月18日',
    type: '规范性文件',
    nature: '推荐性',
    applicableScope: '--',
    domain: '医保',
    classification: '分类与编码',
    keywords: ['医保药品分类与代码数据'],
    hitaId: 'H01897',
    recordDate: '2025-08-02',
    updateDate: '2025-08-02',
    publishDate: '2025-07-18',
    status: '现行'
  },
  {
    id: 'H01901',
    standardNumber: '',
    name: '国家药品编码本位码(截至2025年6月30日)',
    type: '规范性文件',
    nature: '推荐性',
    applicableScope: '--',
    domain: '药械',
    classification: '分类与编码',
    keywords: ['国家药品编码本位码', '国产药品', '进口药品'],
    hitaId: 'H01901',
    recordDate: '2025-08-07',
    updateDate: '2025-08-07',
    publishDate: '2025-06-30',
    status: '现行'
  },
  {
    id: 'H01890',
    standardNumber: '',
    name: '医保药品分类与代码数据(西药、中成药)_截至2025年6月27日',
    type: '规范性文件',
    nature: '推荐性',
    applicableScope: '--',
    domain: '医保',
    classification: '分类与编码',
    keywords: ['医保药品分类与代码数据'],
    hitaId: 'H01890',
    recordDate: '2025-07-16',
    updateDate: '2025-07-16',
    publishDate: '2025-06-27',
    status: '废止'
  }
])

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 770,
  pageSizes: [10, 20, 50, 100]
})

// 监听滚动事件
function handleScroll() {
  backtopVisible.value = window.scrollY > 300
}

// 防抖处理搜索
const debouncedSearch = debounce(search, 500)

// 组件挂载时
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始加载数据
  search()
})

// 组件卸载时
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 重置筛选条件
function resetFilters() {
  filterForm.standardNature = []
  filterForm.standardStatus = []
  filterForm.standardType = []
  filterForm.standardDomain = []
  filterForm.standardClassification = []
  filterForm.publishingOrganization = ''
}

// 搜索操作
function search() {
  // 显示加载状态
  loading.value = true
  
  // 模拟API请求延迟
  setTimeout(() => {
    // 实际项目中这里应该调用API获取数据
    console.log('搜索条件:', searchForm)
    loading.value = false
  }, 500)
}

// 处理分页变化
function handleSizeChange(val) {
  pagination.pageSize = val
  // 实际项目中这里应该重新获取数据
}

function handleCurrentChange(val) {
  pagination.currentPage = val
  // 实际项目中这里应该重新获取数据
}

// 查看详情
function viewDetails(item) {
  // 实际项目中这里应该跳转到详情页或打开详情弹窗
  console.log('查看详情:', item)
}

// 查看数字化内容
function viewDigitalContent(item) {
  // 实际项目中这里应该跳转到数字化内容页面
  console.log('查看数字化内容:', item)
}

// 查看应用支持
function viewApplicationSupport(item) {
  // 实际项目中这里应该跳转到应用支持页面
  console.log('查看应用支持:', item)
}</script>

<template>
  <div class="standard-resource-page">
    <el-backtop :visible="backtopVisible" :scroll-threshold="300" />
    <!-- 面包屑导航 -->
    <div class="fv-breadcrumb mb-4">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>标准文件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 主体内容区域 -->
    <el-row :gutter="20" class="main-content">
      <!-- 左侧搜索和列表区域 -->
      <el-col :span="18" :xs="24" :sm="24" :md="18">
        <!-- 页面标题和搜索区域 -->
        <div class="header-search-section">
          <h1 class="page-title">标准资源</h1>
          
          <div class="search-labels">
            <span class="search-label-item">授权许可：
              <span class="auth-license-item">基础版</span>
              <span class="auth-license-item">进阶版</span>
              <span class="auth-license-item auth-license-item-current">高级版</span>
            </span>
            <span class="search-label-item">形成方式：
              <span class="auth-license-item auth-license-item-current">OMAHA收集加工</span>
            </span>
          </div>
          <!-- 多选条件搜索框 -->
            <!-- 搜索区域 -->
            <div class="search-area">
              <div class="search-form-row">
                <!-- 检索条件 -->
                <el-select v-model="searchForm.searchField" placeholder="全部" class="filter-select">
                  <el-option label="全部" value="全部" />
                  <el-option label="HiTA标识符" value="hitaId" />
                  <el-option label="标准号" value="standardNumber" />
                  <el-option label="标准名称" value="name" />
                  <el-option label="发文字号" value="documentNumber" />
                  <el-option label="适用范围" value="applicableScope" />
                  <el-option label="关键词" value="keywords" />
                </el-select>

                <!-- 搜索框 -->
                <el-input v-model="searchForm.keyword" placeholder="请输入搜索词（多个搜索词用空格隔开）" class="main-search-input" @input="debouncedSearch">
                  <template #append>
                    <el-button type="primary" @click="search">搜索</el-button>
                  </template>
                </el-input>
              </div>

              <!-- 排序 -->
              <div class="standardSortBox">
                <div class="title">排序方式：</div>
                
                <div class="time" :class="{ active: searchForm.sortBy === 'publishDate' }" @click="searchForm.sortBy = 'publishDate'">
                  <span style="cursor: pointer;">标准发布日期</span>
                  <div class="standardSort publishDateOrder">
                    <div class="upper" :class="{ actives: searchForm.sortBy === 'publishDate' && searchForm.sortOrder === 'ASC' }" @click.stop="searchForm.sortOrder = 'ASC'" data-type="ASC"></div>
                    <div class="below" :class="{ actives: searchForm.sortBy === 'publishDate' && searchForm.sortOrder === 'DESC' }" @click.stop="searchForm.sortOrder = 'DESC'" data-type="DESC"></div>
                  </div>
                </div>

                <div class="time" :class="{ active: searchForm.sortBy === 'updateDate' }" @click="searchForm.sortBy = 'updateDate'">
                  <span style="cursor: pointer;">HiTA更新日期</span>
                  <div class="standardSort renewTimeOrder">
                    <div class="upper" :class="{ actives: searchForm.sortBy === 'updateDate' && searchForm.sortOrder === 'ASC' }" @click.stop="searchForm.sortOrder = 'ASC'" data-type="ASC"></div>
                    <div class="below" :class="{ actives: searchForm.sortBy === 'updateDate' && searchForm.sortOrder === 'DESC' }" @click.stop="searchForm.sortOrder = 'DESC'" data-type="DESC"></div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <!-- 列表区域 -->
        <el-card class="list-card">
          <div v-if="loading" class="loading-container">
            <el-loading-spinner style="margin: 50px auto" />
          </div>
          
          <div v-else class="resource-list">
            <div v-for="item in tableData" :key="item.id" class="resource-item">
              <div class="fileListSearchDataList">
                <a href="javascript:void(0)" @click="viewDetails(item)" style="text-decoration:none;">
                  <div class="fileListSearchDataHead">
                    <!-- 标准编号和标签 -->
                    <p style="margin-bottom: 4px;">
                      <span v-if="item.code" class="standardNumber">{{ item.code }}</span>
                      <el-tag
                        size="small"
                        v-if="item.status"
                        :type="item.status === '现行' ? 'success' : (item.status === '废止' ? 'danger' : 'warning')"
                        :class="item.status === '现行' ? 'inForceTab' : (item.status === '废止' ? 'abolishTab' : 'otherTab')"
                        style="margin-right: 6px;">
                        {{ item.status }}
                      </el-tag>
                      <el-tag v-if="item.type" size="small" class="otherTab" style="margin-right: 6px;">{{ item.type }}</el-tag>
                      <el-tag v-if="item.nature" size="small" class="otherTab">{{ item.nature }}</el-tag>
                    </p>
                    
                    <!-- 标准名称 -->
                    <p class="fileTitle">{{ item.name }}</p>
                    
                    <!-- 适用范围 -->
                    <div class="scope">
                      <span class="title">适用范围:</span>
                      <span class="info" :title="item.applicableScope">{{ item.applicableScope || '--' }}</span>
                    </div>
                    
                    <!-- 标准领域 -->
                    <div class="otherList">
                      <span class="otherTitle"><span class="tab"></span><span class="text">标准领域:</span></span>
                      <span class="info">{{ item.domain }}</span>
                    </div>
                    
                    <!-- 标准分类 -->
                    <div class="otherList">
                      <span class="otherTitle"><span class="tab"></span><span class="text">标准分类:</span></span>
                      <span class="info">{{ item.classification }}</span>
                    </div>
                    
                    <!-- 关键词 -->
                    <div class="otherList">
                      <span class="otherTitle"><span class="tab"></span><span class="text">关键词:</span></span>
                      <span class="info keywordData">
                        <span v-for="(keyword, index) in (Array.isArray(item.keywords) ? item.keywords : item.keywords.split('，'))" :key="index">
                          {{ keyword }}
                          <span v-if="index < (Array.isArray(item.keywords) ? item.keywords.length - 1 : item.keywords.split('，').length - 1)">，</span>
                        </span>
                      </span>
                    </div>
                    
                    <!-- HiTA信息 -->
                    <div class="idOrTime">
                      <span>HiTA标识符：<span class="hitaId">{{ item.hitaId }}</span></span>
                      <span>标准发布日期：{{ item.publishDate }}</span>
                      <span>HiTA收录日期：{{ item.recordDate }}</span>
                      <span>HiTA更新日期：{{ item.updateDate }}</span>
                    </div>
                  </div>
                </a>
                <div class="fileListSearchDataFoot">
                  <el-button type="text" @click="viewDetails(item)" class="publicClickStyle">详情</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页区域 -->
          <div class="pagination mt-4">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="pagination.pageSizes"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧筛选条件区域 -->
      <el-col :span="6" :xs="24" :sm="24" :md="6">
        <el-card class="filter-card">
          <template #header>
            <div class="card-header">
              <span>筛选条件</span>
              <el-button type="text" size="small" @click="resetFilters">重置</el-button>
            </div>
          </template>
          <el-form label-position="top" size="small" class="filter-form">
            <!-- 标准性质 -->
            <el-form-item label="标准性质" @change="debouncedSearch">
              <el-checkbox-group v-model="filterForm.standardNature">
                <el-checkbox label="强制性" />
                <el-checkbox label="推荐性" />
                <el-checkbox label="指导性技术文件" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准状态 -->
            <el-form-item label="标准状态" @change="debouncedSearch">
              <el-checkbox-group v-model="filterForm.standardStatus">
                <el-checkbox label="现行" />
                <el-checkbox label="废止" />
                <el-checkbox label="即将实施" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准类型 -->
            <el-form-item label="标准类型" @change="debouncedSearch">
              <el-checkbox-group v-model="filterForm.standardType">
                <el-checkbox label="国际标准" />
                <el-checkbox label="国家标准" />
                <el-checkbox label="行业标准" />
                <el-checkbox label="地方标准" />
                <el-checkbox label="团体标准" />
                <el-checkbox label="规范性文件" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准领域 -->
            <el-form-item label="标准领域" @change="debouncedSearch">
              <el-checkbox-group v-model="filterForm.standardDomain">
                <el-checkbox label="医疗" />
                <el-checkbox label="医保" />
                <el-checkbox label="药械" />
                <el-checkbox label="公卫" />
                <el-checkbox label="医养" />
                <el-checkbox label="其他" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准分类 -->
            <el-form-item label="标准分类" @change="debouncedSearch">
              <el-checkbox-group v-model="filterForm.standardClassification">
                <el-checkbox label="标准体系" />
                <el-checkbox label="标准化技术指南" />
                <el-checkbox label="卫生信息模型" />
                <el-checkbox label="标识" />
                <el-checkbox label="术语" />
                <el-checkbox label="数据元" />
                <el-checkbox label="值域" />
                <el-checkbox label="分类与编码" />
                <el-checkbox label="数据集" />
                <el-checkbox label="共享文档规范" />
                <el-checkbox label="系统规范" />
                <el-checkbox label="建设指南" />
                <el-checkbox label="运维管理" />
                <el-checkbox label="质量控制" />
                <el-checkbox label="其他" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 适用域 -->
            <el-form-item label="适用域" @change="debouncedSearch">
              <el-select v-model="filterForm.applicableDomain" placeholder="请选择适用域" style="width: 100%" multiple>
                <el-option label="医院" value="1" />
                <el-option label="基层医疗卫生机构" value="2" />
                <el-option label="公共卫生机构" value="3" />
                <el-option label="医保机构" value="4" />
                <el-option label="药品监管机构" value="5" />
              </el-select>
            </el-form-item>

            <!-- 发布机构 -->
            <el-form-item label="发布机构" @change="debouncedSearch">
              <el-select v-model="filterForm.publishingOrganization" placeholder="请选择发布机构" style="width: 100%" multiple filterable>
                <el-option label="国家卫生健康委员会" value="1" />
                <el-option label="国家医疗保障局" value="2" />
                <el-option label="国家药品监督管理局" value="3" />
                <el-option label="国家市场监督管理总局" value="4" />
              </el-select>
            </el-form-item>

            <!-- 起草单位 -->
            <el-form-item label="起草单位" @change="debouncedSearch">
              <el-input v-model="filterForm.draftingOrganization" placeholder="请输入起草单位" style="width: 100%" />
            </el-form-item>

            <!-- 归口单位 -->
            <el-form-item label="归口单位" @change="debouncedSearch">
              <el-input v-model="filterForm.responsibleOrganization" placeholder="请输入归口单位" style="width: 100%" />
            </el-form-item>

            <!-- 中国标准分类号(CCS) -->
            <el-form-item label="中国标准分类号(CCS)" @change="debouncedSearch">
              <el-input v-model="filterForm.ccs" placeholder="请输入中国标准分类号" style="width: 100%" />
            </el-form-item>

            <!-- 国际标准分类号(ICS) -->
            <el-form-item label="国际标准分类号(ICS)" @change="debouncedSearch">
              <el-input v-model="filterForm.ics" placeholder="请输入国际标准分类号" style="width: 100%" />
            </el-form-item>

            <!-- 发布日期 -->
            <el-form-item label="发布日期" @change="debouncedSearch">
              <el-date-picker
                v-model="filterForm.publishDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 实施日期 -->
            <el-form-item label="实施日期" @change="debouncedSearch">
              <el-date-picker
                v-model="filterForm.implementDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 是否有解读文件 -->
            <el-form-item label="是否有解读文件" @change="debouncedSearch">
              <el-checkbox v-model="filterForm.hasInterpretation">是</el-checkbox>
            </el-form-item>

            <!-- 是否包含专利信息 -->
            <el-form-item label="是否包含专利信息" @change="debouncedSearch">
              <el-checkbox v-model="filterForm.hasPatent">是</el-checkbox>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.standard-resource-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-muted {
  color: #999;
  font-size: 14px;
}

.filter-card {
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    overflow: hidden;
  }

  .filter-form .el-form-item {
    margin-bottom: 16px;
  }

  .filter-form .el-form-item__label {
    padding: 0 12px 0 0;
    color: #606266;
    font-size: 13px;
    line-height: 32px;
    display: inline-block;
    white-space: nowrap;
    font-weight: 500;
  }

  .filter-form .el-form-item__content {
    line-height: 32px;
  }

  .filter-form .el-checkbox {
    margin-right: 8px;
    margin-bottom: 6px;
  }

  .filter-form .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }

  .filter-form .el-select,
  .filter-form .el-input {
    width: 100%;
  }

  .filter-form .el-date-editor {
    width: 100%;
  }

.list-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.text-primary {
  color: var(--el-color-primary);
  transition: all 0.3s;
}

.text-primary:hover {
  color: var(--el-color-primary-light-3);
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}

.fv-breadcrumb {
  padding: 0 16px;
}

.page-header {
  padding: 0 16px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.page-desc {
  font-size: 14px;
  color: #666;
}

.main-content {
  margin-top: 20px;
}

/* 搜索区域样式 */
.header-search-section {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin-bottom: 16px;
  max-width: 100%;
}

/* 搜索区域优化 */
.search-area {
  margin-bottom: 16px;
}

.search-form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.filter-select {
  width: 120px;
  border-radius: 4px;
  font-size: 14px;
}

.main-search-input {
  flex: 1;
  max-width: 800px;
}

.main-search-input .el-input__wrapper {
  border-radius: 4px 0 0 4px;
}

.main-search-input .el-button {
  border-radius: 0 4px 4px 0;
  padding: 0 16px;
  height: 32px;
}

/* 排序区域优化 */
.sort-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
}

.sort-label {
  color: #606266;
  font-size: 14px;
  margin-right: 8px;
}

.sort-item {
  display: flex;
  align-items: center;
  margin-right: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
}

.sort-item:hover {
  background-color: #f5f7fa;
}

.sort-item.active {
  color: #3370ff;
  background-color: #e6f7ff;
}

.sort-arrows {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
  height: 16px;
  justify-content: center;
}

.sort-arrow {
  font-size: 10px;
  color: #909399;
  line-height: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-arrow:hover {
  color: #606266;
}

.sort-arrow.active {
  color: #3370ff;
}

/* 排序区域样式 */
.multipleConditionsSearchBox {
  display: none;
}

.filterBox {
  display: none;
}

.searchBox {
  display: none;
}

.standardSortBox {
  display: none;
}

.sortTitle {
  display: none;
}

.sortItem {
  display: none;
}

.standardSort {
  display: none;
}

.sortIcon {
  display: none;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin: 0 0 12px 0;
}

.search-labels {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-label-item {
  margin-right: 10px;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.auth-license-item {
  display: inline-block;
  padding: 2px 8px;
  margin: 0 4px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: #606266;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-license-item:hover {
  border-color: #c0c4cc;
}

.auth-license-item-current {
  color: #0FAFB9;
  border-color: #0FAFB9;
  background-color: #fff;
  font-weight: 500;
}

.search-form {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-form .el-form-item {
  margin-right: 10px;
  margin-bottom: 0;
}

/* 标签样式优化 */
.el-tag {
  border-radius: 4px;
  height: 20px;
  line-height: 20px;
  margin-right: 8px;
  font-size: 12px;
}

.status-tag {
  background-color: #f0f9eb;
  color: #67c23a;
  border-color: #c2e7b0;
}

.type-tag {
  background-color: #e3f2fd;
  color: #2196f3;
  border-color: #90caf9;
}

.nature-tag {
  background-color: #fff3e0;
  color: #fa8c16;
  border-color: #ffcc80;
}

/* 按钮样式优化 */
.el-button {
  border-radius: 4px;
  font-size: 14px;
}

/* 输入框样式优化 */
.el-input__wrapper {
  border-radius: 4px;
}

/* 资源列表样式 */
.resource-list {
  margin-top: 0;
}

.resource-item {
  margin-bottom: 10px;
  /* 移除边框和内边距，避免双层框效果 */
}

/* 将悬停效果移至fileListSearchDataList */
.fileListSearchDataList:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-color: #3370ff;
}

.resource-item:last-child {
  margin-bottom: 0;
}

.resource-header {
  margin-bottom: 12px;
}

.resource-id-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.resource-code {
  font-weight: bold;
  color: #333;
  font-size: 16px;
  margin-right: 12px;
}

.resource-title-only {
  font-weight: bold;
  color: #3370ff;
  font-size: 16px;
  margin-right: 12px;
}

.status-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.resource-content {
  margin-bottom: 10px;
}

.resource-name {
  font-size: 16px;
  font-weight: 600;
}

/* 排序区域样式 */
.multipleConditionsSearchBox {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.filterBox {
  margin-right: 10px;
  flex-shrink: 0;
}

.searchBox {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 200px;
}

.standardSortBox {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
}

.title {
  color: #606266;
  font-size: 14px;
  margin-right: 16px;
}

.time {
  display: flex;
  align-items: center;
  margin-right: 20px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
}

.time:hover {
  background-color: #f5f7fa;
}

.time.active {
  color: #3370ff;
  background-color: #e6f7ff;
}

.standardSort {
  display: flex;
  flex-direction: column;
  margin-left: 4px;
  height: 16px;
  justify-content: center;
  width: 12px;
}

.upper, .below {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.upper {
  border-bottom: 5px solid #909399;
  margin-bottom: 2px;
}

.upper:hover {
  border-bottom-color: #606266;
}

.below {
  border-top: 5px solid #909399;
}

.below:hover {
  border-top-color: #606266;
}

.upper.actives {
  border-bottom-color: #3370ff;
}

.below.actives {
  border-top-color: #3370ff;
}

.standardNum {
  margin-left: auto;
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* 资源列表显示优化 */
.fileListSearchDataList {
  position: relative;
  padding: 16px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.fileListSearchDataList:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-color: #3370ff;
}

.fileListSearchDataHead {
  margin-bottom: 12px;
}

.standard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.standardNumber {
  font-weight: bold;
  color: #333;
  font-size: 16px;
  margin-right: 12px;
}

.fileTitle {
  font-size: 16px;
  font-weight: 600;
  color: #3370ff;
  margin: 0 0 12px 0;
}

.standard-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: 10px;
}

.scope {
  margin-bottom: 12px;
  line-height: 1.6;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.scope .title {
  color: #909399;
  font-size: 14px;
  margin-right: 8px;
  flex-shrink: 0;
}

.scope .info {
  color: #333;
  font-size: 14px;
  flex: 1;
}

.otherList {
  margin-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.otherTitle {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 14px;
  margin-right: 8px;
  flex-shrink: 0;
}

.otherTitle .tab {
  width: 4px;
  height: 4px;
  background-color: #909399;
  border-radius: 50%;
  margin-right: 6px;
  display: inline-block;
}

.otherList .info {
  color: #333;
  font-size: 14px;
  flex: 1;
}

.keywordData {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.fileListSearchDataFoot {
  display: flex;
  justify-content: flex-start;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px dashed #e4e7ed;
}

.publicClickStyle {
  color: #3370ff;
  font-size: 14px;
  padding: 5px 0;
  border-radius: 4px;
}

.publicClickStyle:hover {
  background-color: #f0f2ff;
}

.resource-name a {
  color: #3370ff;
  text-decoration: none;
}

.resource-name a:hover {
  text-decoration: underline;
}

.resource-scope {
  margin-bottom: 12px;
  line-height: 1.6;
}

.scope-label {
  color: #909399;
  font-size: 14px;
}

.scope-content {
  color: #606266;
  font-size: 14px;
  margin-left: 5px;
}

.resource-meta {
  margin-bottom: 12px;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 6px;
  font-size: 13px;
}

.meta-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
  position: relative;
}

.meta-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background-color: #909399;
  border-radius: 50%;
}

.meta-label {
  color: #909399;
  min-width: 80px;
  flex-shrink: 0;
}

.meta-value {
  color: #333;
  flex: 1;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.keyword-tag {
  margin: 0;
  border-radius: 12px;
  font-size: 12px;
  padding: 2px 8px;
  background-color: #f0f2f5;
  color: #606266;
  border: none;
}

.resource-footer-info {
  font-size: 13px;
  color: #909399;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hita-id {
  color: #3370ff;
  font-weight: 500;
}

.resource-actions {
    display: flex;
    justify-content: flex-end;
    border-top: 1px dashed #e4e7ed;
    padding-top: 12px;
    margin-top: 12px;
  }

  .action-buttons {
    display: flex;
    align-items: center;
  }

  .idOrTime {
    margin-top: 10px;
    color: #909399;
    font-size: 12px;
    display: flex;
    flex-wrap: wrap;
  }

  .idOrTime span {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 4px;
  }

  .hitaId {
    color: #409eff;
  }

.action-btn {
  margin-left: 20px;
  color: #3370ff !important;
  font-size: 14px;
  padding: 5px 0;
  border-radius: 4px;
}

.action-btn:first-child {
  margin-left: 0;
}

.action-btn:hover {
  background-color: #f0f2ff;
}

.loading-container {
  text-align: center;
  padding: 60px 0;
}

/* 响应式调整 */
@media screen and (max-width: 1200px) {
  .searchBox {
    max-width: 500px;
  }
}

@media screen and (max-width: 992px) {
  .multipleConditionsSearchBox {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filterBox {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .searchBox {
    max-width: 100%;
  }
  
  .standardSortBox {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .standardNum {
    margin-left: 0;
    margin-top: 8px;
  }
}

@media screen and (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form .el-form-item {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .search-label-item {
    margin-bottom: 8px;
  }
  
  .resource-id-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .resource-update-date {
    margin-top: 5px;
  }
  
  .resource-actions {
    justify-content: flex-start;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .action-btn {
    margin-left: 0;
    margin-right: 20px;
    margin-bottom: 5px;
  }
  
  .standard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .standard-tags {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
