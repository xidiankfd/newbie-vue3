<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElCard, ElCol, ElDescriptions, ElRow, ElTabPane, ElTabs, ElTag }
  from 'element-plus'

const route = useRoute()
const router = useRouter()
const standardId = route.params.id

// 模拟详情数据
const detailData = ref({
  id: 'WS/T 865-2025',
  standardNumber: 'WS/T 865-2025',
  name: '血站采供血基本数据集',
  type: '行业标准',
  nature: '推荐性',
  domain: '医疗',
  classification: '数据集',
  hitaId: 'H01893',
  recordDate: '2025-07-23',
  updateDate: '2025-07-23',
  status: '现行',
  issuingDepartment: '国家卫生健康委员会',
  implementationDate: '2025-12-01',
  replacementStandard: '',
  scope: '本标准规定了血站采供血基本数据集的元数据属性和数据元属性。本标准适用于血站采供血基本信息的采集、存储与共享，以及血站信息系统的开发建设。',
  keywords: ['采供血', '血液中心', '血液管理', '血液质量控制', '基本数据'],
  description: '血站采供血基本数据集是医疗卫生领域血液管理的基础标准，提供了一套统一的血站采供血信息分类和数据元规范，用于血站信息系统建设、数据统计和分析等方面。该标准有助于提高血液管理的标准化水平，保障血液安全。',
  relatedStandards: [
    'WS/T 866-2025 医疗机构临床用血基本数据集',
    'WS/T 867-2025 医疗机构临床用血信息系统基本功能标准',
    'WS/T 869-2025 一般血站设备配置基本标准',
  ],
  relatedSystems: [
    '血站信息系统',
    '血液中心管理系统',
    '临床用血系统',
    '血液质量管理系统',
  ],
  references: [
    'WHO血液安全管理指南',
    'ISO 15189:2012 医学实验室质量和能力的要求',
  ],
})

onMounted(() => {
  // 实际项目中这里应该根据standardId调用API获取数据
  console.log('获取标准ID:', standardId)
})

// 返回列表页面
function goBack() {
  router.push('/standardResource')
}

// 查看数字化内容
function viewDigitalContent() {
  router.push({ path: '/standardResource/digitalContent', query: { id: standardId } })
}

// 查看应用支持
function viewApplicationSupport() {
  router.push({ path: '/standardResource/applicationSupport', query: { id: standardId } })
}
</script>

<script>
export default {
  data() {
    return {
      activeTab: 'overview',
    }
  },
}
</script>

<template>
  <div class="standard-detail-page">
    <!-- 面包屑导航 -->
    <div class="fv-breadcrumb mb-4">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="goBack">
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item @click="goBack">
          标准文件
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ detailData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons mb-4">
      <ElButton @click="goBack">
        返回
      </ElButton>
      <ElButton type="primary" @click="viewDigitalContent">
        查看数字化内容
      </ElButton>
      <ElButton type="primary" @click="viewApplicationSupport">
        查看应用支持
      </ElButton>
    </div>

    <!-- 基本信息卡片 -->
    <ElCard class="mb-4 detail-header-card">
      <template #header>
        <div class="detail-header">
          <div class="standard-title-section">
            <h1 class="standard-number" v-if="detailData.standardNumber">{{ detailData.standardNumber }}</h1>
            <h2 class="standard-name">{{ detailData.name }}</h2>
          </div>
          <div class="status-badge-group">
            <ElTag
              size="default"
              :type="detailData.status === '现行' ? 'success' : (detailData.status === '废止' ? 'danger' : 'warning')"
              class="status-badge">
              {{ detailData.status }}
            </ElTag>
            <ElTag size="default" class="type-badge">{{ detailData.type }}</ElTag>
            <ElTag
              size="default"
              :type="detailData.nature === '强制性' ? 'danger' : 'success'"
              class="nature-badge">
              {{ detailData.nature }}
            </ElTag>
          </div>
        </div>
      </template>

      <!-- 适用范围 -->
      <div class="scope-section mb-4">
        <h3 class="section-title">适用范围:</h3>
        <p class="scope-text">{{ detailData.scope }}</p>
      </div>

      <!-- 详细信息表格 -->
      <ElDescriptions column="2" border :content-style="{ padding: '12px 16px' }" :label-style="{ width: '140px', background: '#f8f9fa' }">
        <el-descriptions-item label="标准领域">
          <ElTag type="primary" size="small">{{ detailData.domain }}</ElTag>
        </el-descriptions-item>
        <el-descriptions-item label="标准分类">
          <ElTag type="info" size="small">{{ detailData.classification }}</ElTag>
        </el-descriptions-item>
        <el-descriptions-item label="HiTA标识符">
          <span class="hita-id-badge">{{ detailData.hitaId }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="发布机构">
          {{ detailData.issuingDepartment }}
        </el-descriptions-item>
        <el-descriptions-item label="HiTA收录日期">
          {{ detailData.recordDate }}
        </el-descriptions-item>
        <el-descriptions-item label="HiTA更新日期">
          {{ detailData.updateDate }}
        </el-descriptions-item>
        <el-descriptions-item label="实施日期" v-if="detailData.implementationDate">
          {{ detailData.implementationDate }}
        </el-descriptions-item>
        <el-descriptions-item label="替代标准" v-if="detailData.replacementStandard">
          {{ detailData.replacementStandard }}
        </el-descriptions-item>
        <el-descriptions-item label="关键词" :span="2">
          <div class="keywords-section">
            <ElTag
              v-for="keyword in (Array.isArray(detailData.keywords) ? detailData.keywords : detailData.keywords.split('，'))"
              :key="keyword"
              type="info"
              size="small"
              class="keyword-tag">
              {{ keyword }}
            </ElTag>
          </div>
        </el-descriptions-item>
      </ElDescriptions>
    </ElCard>

    <!-- 详细内容标签页 -->
    <ElTabs v-model="activeTab" type="card">
      <!-- 标准概述 -->
      <ElTabPane label="标准概述" name="overview">
        <ElCard>
          <h3 class="section-title mb-4">
            适用范围
          </h3>
          <p class="mb-6">
            {{ detailData.scope }}
          </p>
          <h3 class="section-title mb-4">
            标准简介
          </h3>
          <p>
            {{ detailData.description }}
          </p>
        </ElCard>
      </ElTabPane>

      <!-- 相关标准 -->
      <ElTabPane label="相关标准" name="related">
        <ElCard>
          <ElRow :gutter="20">
            <ElCol :span="24">
              <h3 class="section-title mb-4">
                相关标准列表
              </h3>
              <ul class="related-list">
                <li v-for="(standard, index) in detailData.relatedStandards" :key="index" class="related-item">
                  <ElTag size="small" type="primary" class="mr-2">
                    {{ index + 1 }}
                  </ElTag>
                  {{ standard }}
                </li>
              </ul>
            </ElCol>
          </ElRow>
        </ElCard>
      </ElTabPane>

      <!-- 应用场景 -->
      <ElTabPane label="应用场景" name="application">
        <ElCard>
          <h3 class="section-title mb-4">
            适用系统
          </h3>
          <div class="system-tags mb-6">
            <ElTag v-for="(system, index) in detailData.relatedSystems" :key="index" type="success" class="mr-2 mb-2">
              {{ system }}
            </ElTag>
          </div>
          <h3 class="section-title mb-4">
            应用说明
          </h3>
          <p>该标准主要应用于医疗卫生领域的信息系统建设，用于规范疾病数据的分类和编码，确保不同系统之间的数据交换和共享。</p>
        </ElCard>
      </ElTabPane>

      <!-- 引用文献 -->
      <ElTabPane label="引用文献" name="references">
        <ElCard>
          <ul class="reference-list">
            <li v-for="(reference, index) in detailData.references" :key="index" class="reference-item">
              <ElTag size="small" type="info" class="mr-2">
                {{ index + 1 }}
              </ElTag>
              {{ reference }}
            </li>
          </ul>
        </ElCard>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped>
.standard-detail-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.detail-header-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.standard-title-section {
  flex: 1;
}

.standard-number {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.standard-name {
  font-size: 18px;
  font-weight: 600;
  color: #3370ff;
  margin: 0;
  line-height: 1.4;
}

.status-badge-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.status-badge,
.type-badge,
.nature-badge {
  border-radius: 4px;
  font-weight: 500;
  padding: 6px 12px;
  font-size: 13px;
}

.scope-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid #3370ff;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.scope-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.hita-id-badge {
  background-color: #e6f3ff;
  color: #3370ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
}

.keywords-section {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.keyword-tag {
  margin: 0;
  border-radius: 12px;
  background-color: #f0f2f5;
  color: #606266;
  border: 1px solid #dcdfe6;
  font-size: 12px;
  padding: 2px 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  padding: 0 16px;
}

.related-list,
.reference-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-item,
.reference-item {
  padding: 12px 0;
  border-bottom: 1px dashed #ebeef5;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.related-item:last-child,
.reference-item:last-child {
  border-bottom: none;
}

.system-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.system-tags .el-tag {
  margin: 0;
}

.fv-breadcrumb {
  padding: 0 16px;
}

/* 标签页样式优化 */
:deep(.el-tabs__nav-wrap) {
  background: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.el-tabs__content) {
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

:deep(.el-tabs__item) {
  font-weight: 500;
}

:deep(.el-descriptions__label) {
  color: #606266;
  font-weight: 500;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: stretch;
  }

  .status-badge-group {
    justify-content: flex-start;
  }

  .standard-number {
    font-size: 18px;
  }

  .standard-name {
    font-size: 16px;
  }
}
</style>
