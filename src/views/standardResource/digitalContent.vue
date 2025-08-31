<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElCard, ElTabs, ElTabPane, ElTable, ElTableColumn, ElTag, ElButton, ElTree, ElIcon } from 'element-plus'
import { ChevronRight, Download, FileText, Table, Database, Code }
 from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const standardId = route.query.id

// 模拟数字化内容数据
const standardInfo = ref({
  id: 'GB/T 14396-2016',
  name: '疾病分类与代码',
  version: '2016'
})

// 标准内容树
const contentTree = ref([
  {
    label: '1 范围',
    children: [
      { label: '1.1 主要内容' },
      { label: '1.2 适用范围' }
    ]
  },
  {
    label: '2 规范性引用文件',
    children: [
      { label: '2.1 引用标准' },
      { label: '2.2 引用说明' }
    ]
  },
  {
    label: '3 术语和定义',
    children: [
      { label: '3.1 疾病分类' },
      { label: '3.2 编码规则' }
    ]
  },
  {
    label: '4 分类和编码',
    children: [
      { label: '4.1 分类原则' },
      { label: '4.2 编码结构' },
      { label: '4.3 分类体系' }
    ]
  }
])

// 数据元素列表
const dataElements = ref([
  {
    id: 'DE001',
    name: '疾病编码',
    definition: '疾病分类的唯一标识符',
    dataType: '字符串',
    length: '6',
    constraints: '必填，符合编码规则',
    note: '国际疾病分类编码'
  },
  {
    id: 'DE002',
    name: '疾病名称',
    definition: '疾病的标准名称',
    dataType: '字符串',
    length: '100',
    constraints: '必填',
    note: '中文标准名称'
  },
  {
    id: 'DE003',
    name: '疾病分类',
    definition: '疾病所属的分类',
    dataType: '字符串',
    length: '2',
    constraints: '必填',
    note: '大类编码'
  },
  {
    id: 'DE004',
    name: '病因分类',
    definition: '疾病发生的原因分类',
    dataType: '字符串',
    length: '1',
    constraints: '可选',
    note: '病因编码'
  }
])

// 代码表数据
const codeTables = ref([
  {
    tableName: '疾病大类',
    tableCode: 'DISEASE_MAJOR_CATEGORY',
    description: '疾病分类的大类代码表',
    rows: [
      { code: 'A', name: '某些传染病和寄生虫病' },
      { code: 'B', name: '肿瘤' },
      { code: 'C', name: '血液及造血器官疾病和某些涉及免疫机制的疾患' },
      { code: 'D', name: '内分泌、营养和代谢疾病' },
      { code: 'E', name: '精神和行为障碍' }
    ]
  },
  {
    tableName: '病因分类',
    tableCode: 'ETIOLOGY_CATEGORY',
    description: '疾病发生原因的分类代码表',
    rows: [
      { code: '1', name: '感染性' },
      { code: '2', name: '遗传性' },
      { code: '3', name: '免疫性' },
      { code: '4', name: '物理性' },
      { code: '5', name: '化学性' }
    ]
  }
])

onMounted(() => {
  // 实际项目中这里应该根据standardId调用API获取数据
  console.log('获取标准数字化内容，ID:', standardId)
})

// 返回详情页面
function goBack() {
  router.push({ path: '/standardResource/detail', params: { id: standardId } })
}

// 查看详情
function viewDetail() {
  router.push({ path: '/standardResource/detail', params: { id: standardId } })
}

// 查看应用支持
function viewApplicationSupport() {
  router.push({ path: '/standardResource/applicationSupport', query: { id: standardId } })
}
</script>

<template>
  <div class="digital-content-page">
    <!-- 面包屑导航 -->
    <div class="fv-breadcrumb mb-4">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="$router.push('/standardResource')">首页</el-breadcrumb-item>
        <el-breadcrumb-item @click="$router.push('/standardResource')">标准文件</el-breadcrumb-item>
        <el-breadcrumb-item @click="viewDetail">{{ standardInfo.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>数字化内容</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons mb-4">
      <el-button @click="goBack">返回</el-button>
      <el-button @click="viewApplicationSupport">查看应用支持</el-button>
      <el-button type="primary" icon="Download" size="small" class="ml-auto">
        <ElIcon><Download /></ElIcon>
        下载数字化文件
      </el-button>
    </div>

    <!-- 数字化内容标签页 -->
    <el-tabs v-model="activeTab" type="card">
      <!-- 标准内容 -->
      <el-tab-pane label="标准内容" name="content">
        <el-card>
          <div class="content-tree-container">
            <el-tree
              :data="contentTree"
              node-key="label"
              default-expand-all
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 数据元素 -->
      <el-tab-pane label="数据元素" name="elements">
        <el-card>
          <el-table :data="dataElements" border stripe style="width: 100%">
            <el-table-column prop="id" label="数据元素ID" width="100" />
            <el-table-column prop="name" label="数据元素名称" width="150" />
            <el-table-column prop="definition" label="定义" min-width="200" />
            <el-table-column prop="dataType" label="数据类型" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.dataType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="长度" width="80" />
            <el-table-column prop="constraints" label="约束条件" width="120" />
            <el-table-column prop="note" label="备注" min-width="150" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 代码表 -->
      <el-tab-pane label="代码表" name="codeTables">
        <el-card>
          <div class="code-tables-container">
            <div v-for="(table, index) in codeTables" :key="index" class="code-table-item mb-6">
              <div class="code-table-header">
                <div class="code-table-title">
                  <ElIcon><Table /></ElIcon>
                  {{ table.tableName }}
                </div>
                <div class="code-table-info">
                  <span class="code-table-code">编码：{{ table.tableCode }}</span>
                  <span class="code-table-desc">{{ table.description }}</span>
                </div>
              </div>
              <el-table :data="table.rows" border stripe size="small" style="width: 100%">
                <el-table-column prop="code" label="代码" width="100" />
                <el-table-column prop="name" label="名称" min-width="200" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'content'
    }
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class="tree-node-content">
          <span>{node.label}</span>
          <ElIcon class="tree-node-icon"><ChevronRight /></ElIcon>
        </span>
      )
    }
  }
}
</script>

<style scoped>
.digital-content-page {
  padding: 16px;
}

.action-buttons {
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.action-buttons .ml-auto {
  margin-left: auto;
}

.content-tree-container {
  padding: 16px;
}

.tree-node-content {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.tree-node-icon {
  margin-left: auto;
  color: #c0c4cc;
}

.code-tables-container {
  padding: 8px;
}

.code-table-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.code-table-header {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.code-table-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.code-table-title :deep(.el-icon) {
  margin-right: 8px;
}

.code-table-info {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.code-table-code {
  margin-right: 20px;
}

.fv-breadcrumb {
  padding: 0 16px;
}
</style>