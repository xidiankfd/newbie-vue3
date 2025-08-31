<script setup>
import { reactive, ref } from 'vue'
import { ElCard, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElTable, ElTableColumn, ElTag, ElRow, ElCol, ElCheckbox, ElCheckboxGroup, ElPagination } from 'element-plus'

// 搜索条件状态
const searchForm = reactive({
  keyword: '',
  standardType: '全部',
  status: '全部',
  domain: '全部'
})

// 筛选条件状态
const filterForm = reactive({
  standardNature: [],
  standardStatus: [],
  standardType: [],
  standardDomain: [],
  standardClassification: [],
  publishingOrganization: ''
})

// 表格数据
const tableData = ref([
  {
    id: 'GB/T 14396-2016',
    name: '疾病分类与代码',
    type: '国家标准',
    nature: '推荐性',
    applicableScope: '本标准规定了疾病、损伤和中毒及其外部原因，与保健机构接触的非医疗理由和肿瘤形态学的分类与代码。本标准适用于医疗卫生服务、医疗保障、人口管理等部门中对疾病，伤病等分类，并用信息处理与交换、统计分析。',
    domain: '医疗',
    classification: '分类与编码',
    keywords: '疾病分类，互联互通测评，数据上报，数据交换',
    hitaId: 'HO0001',
    recordDate: '2019-07-26',
    updateDate: '2024-07-30',
    status: '现行'
  },
  {
    id: 'T/CHIA 001-2017',
    name: '手术、操作分类与代码',
    type: '团体标准',
    nature: '推荐性',
    applicableScope: '本标准规定了手术、操作的分类与代码。本标准适用于医疗卫生服务、医疗保障、公安、民政等领域，为医疗机构出院患者的手术、操作数据分类，并用信息处理与交换、统计分析。',
    domain: '医疗',
    classification: '分类与编码',
    keywords: '手术操作分类，互联互通测评，数据上报，数据交换',
    hitaId: 'HO0002',
    recordDate: '2019-07-26',
    updateDate: '2024-07-30',
    status: '现行'
  },
  {
    id: 'WS 446-2014',
    name: '居民健康档案医学检验项目常用代码',
    type: '行业标准',
    nature: '强制性',
    applicableScope: '本标准依据医学检验项目的检测物（成分）及其他相关性，规定了我国居民健康档案中的医学检验项目常用代码。',
    domain: '医疗',
    classification: '数据元',
    keywords: '健康档案，医学检验，代码',
    hitaId: 'HO0003',
    recordDate: '2019-08-15',
    updateDate: '2024-06-20',
    status: '现行'
  }
])

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 770,
  pageSizes: [10, 20, 50, 100]
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
  // 实际项目中这里应该调用API获取数据
  console.log('搜索条件:', searchForm)
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
}
</script>

<template>
  <div class="standard-resource-page">
    <!-- 面包屑导航 -->
    <div class="fv-breadcrumb mb-4">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>标准文件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 主体内容区域 -->
    <el-row :gutter="20">
      <!-- 左侧筛选条件区域 -->
      <el-col :span="6">
        <el-card class="filter-card">
          <template #header>
            <div class="card-header">
              <span>筛选条件</span>
              <el-button type="text" size="small" @click="resetFilters">重置</el-button>
            </div>
          </template>
          <el-form label-position="top" size="small">
            <!-- 标准性质 -->
            <el-form-item label="标准性质">
              <el-checkbox-group v-model="filterForm.standardNature">
                <el-checkbox label="强制性" />
                <el-checkbox label="推荐性" />
                <el-checkbox label="指导性技术文件" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准状态 -->
            <el-form-item label="标准状态">
              <el-checkbox-group v-model="filterForm.standardStatus">
                <el-checkbox label="现行" />
                <el-checkbox label="废止" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准类型 -->
            <el-form-item label="标准类型">
              <el-checkbox-group v-model="filterForm.standardType">
                <el-checkbox label="国家标准" />
                <el-checkbox label="行业标准" />
                <el-checkbox label="地方标准" />
                <el-checkbox label="团体标准" />
                <el-checkbox label="规范性文件" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准领域 -->
            <el-form-item label="标准领域">
              <el-checkbox-group v-model="filterForm.standardDomain">
                <el-checkbox label="医疗" />
                <el-checkbox label="医保" />
                <el-checkbox label="公卫" />
                <el-checkbox label="医养" />
                <el-checkbox label="其他" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 标准分类 -->
            <el-form-item label="标准分类">
              <el-checkbox-group v-model="filterForm.standardClassification">
                <el-checkbox label="标准体系" />
                <el-checkbox label="标准技术指南" />
                <el-checkbox label="卫生信息模型" />
                <el-checkbox label="数据元" />
                <el-checkbox label="值域" />
                <el-checkbox label="分类与编码" />
                <el-checkbox label="数据集" />
                <el-checkbox label="统计指标" />
                <el-checkbox label="接口规范" />
                <el-checkbox label="数据规范" />
                <el-checkbox label="信息安全规范" />
                <el-checkbox label="建设指南" />
                <el-checkbox label="运维管理" />
                <el-checkbox label="质量控制" />
                <el-checkbox label="其他" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 发布机构 -->
            <el-form-item label="发布机构">
              <el-select v-model="filterForm.publishingOrganization" placeholder="请选择发布机构" style="width: 100%">
                <el-option label="国家卫生健康委员会" value="1" />
                <el-option label="国家医疗保障局" value="2" />
                <el-option label="国家药品监督管理局" value="3" />
                <!-- 更多选项 -->
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧搜索和列表区域 -->
      <el-col :span="18">
        <!-- 搜索区域 -->
        <el-card class="search-card mb-4">
          <el-form :model="searchForm" layout="inline" size="small">
            <el-form-item label="授权许可">
              <el-select v-model="searchForm.standardType" placeholder="全部">
                <el-option label="全部" value="全部" />
                <el-option label="基础版" value="基础版" />
                <el-option label="进阶版" value="进阶版" />
                <el-option label="高级版" value="高级版" />
              </el-select>
            </el-form-item>
            <el-form-item label="形成方式">
              <el-select v-model="searchForm.status" placeholder="全部">
                <el-option label="全部" value="全部" />
                <el-option label="OMAHA收集加工" value="OMAHA收集加工" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序方式">
              <el-select v-model="searchForm.domain" placeholder="综合">
                <el-option label="综合" value="综合" />
                <el-option label="更新日期" value="更新日期" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.keyword" placeholder="请输入关键词（多个关键词用逗号隔开）" style="width: 240px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 列表区域 -->
        <el-card class="list-card">
          <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="id" label="标准编号" width="180" />
            <el-table-column prop="name" label="标准名称" min-width="200">
              <template #default="{ row }">
                <span class="text-primary cursor-pointer" @click="viewDetails(row)">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="标准类型" width="120">
              <template #default="{ row }">
                <el-tag size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="nature" label="标准性质" width="100">
              <template #default="{ row }">
                <el-tag size="small" :type="row.nature === '强制性' ? 'danger' : 'success'">
                  {{ row.nature }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="applicableScope" label="适用范围" min-width="300" show-overflow-tooltip />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="text" size="small" @click="viewDetails(row)">详情</el-button>
                <el-button type="text" size="small" @click="viewDigitalContent(row)">数字化内容</el-button>
                <el-button type="text" size="small" @click="viewApplicationSupport(row)">应用支持</el-button>
              </template>
            </el-table-column>
          </el-table>

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
    </el-row>
  </div>
</template>

<style scoped>
.standard-resource-page {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-card {
  height: fit-content;
}

.search-card .el-form-item {
  margin-right: 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.text-primary {
  color: var(--el-color-primary);
}

.cursor-pointer {
  cursor: pointer;
}

.fv-breadcrumb {
  padding: 0 16px;
}
</style>