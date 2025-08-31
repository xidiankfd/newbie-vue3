<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElCard, ElDescriptions, ElTag, ElButton, ElDivider, ElRow, ElCol, ElTabs, ElTabPane }
 from 'element-plus'

const route = useRoute()
const router = useRouter()
const standardId = route.params.id

// 模拟详情数据
const detailData = ref({
  id: 'GB/T 14396-2016',
  name: '疾病分类与代码',
  type: '国家标准',
  nature: '推荐性',
  domain: '医疗',
  classification: '分类与编码',
  hitaId: 'HO0001',
  recordDate: '2019-07-26',
  updateDate: '2024-07-30',
  status: '现行',
  issuingDepartment: '国家卫生健康委员会',
  implementationDate: '2017-01-01',
  replacementStandard: 'GB/T 14396-2001',
  scope: '本标准规定了疾病、损伤和中毒及其外部原因，与保健机构接触的非医疗理由和肿瘤形态学的分类与代码。本标准适用于医疗卫生服务、医疗保障、人口管理等部门中对疾病，伤病等分类，并用信息处理与交换、统计分析。',
  keywords: '疾病分类，互联互通测评，数据上报，数据交换',
  description: '疾病分类与代码是医疗卫生领域的基础标准，提供了一套统一的疾病分类和编码体系，用于医疗机构的信息系统建设、数据统计和分析等方面。',
  relatedStandards: [
    'GB/T 2261.1-2003 个人基本信息分类与代码 第1部分：人的性别代码',
    'GB/T 2261.2-2003 个人基本信息分类与代码 第2部分：婚姻状况代码'
  ],
  relatedSystems: [
    '医院信息系统',
    '电子病历系统',
    '居民健康档案系统'
  ],
  references: [
    'WHO. International Statistical Classification of Diseases and Related Health Problems 10th Revision (ICD-10).'
  ]
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

<template>
  <div class="standard-detail-page">
    <!-- 面包屑导航 -->
    <div class="fv-breadcrumb mb-4">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="goBack">首页</el-breadcrumb-item>
        <el-breadcrumb-item @click="goBack">标准文件</el-breadcrumb-item>
        <el-breadcrumb-item>{{ detailData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons mb-4">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="viewDigitalContent">查看数字化内容</el-button>
      <el-button type="primary" @click="viewApplicationSupport">查看应用支持</el-button>
    </div>

    <!-- 基本信息卡片 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span class="text-lg font-semibold">{{ detailData.name }}</span>
          <div style="display: flex; gap: 8px;">
            <el-tag :type="detailData.status === '现行' ? 'success' : 'danger'">
              {{ detailData.status }}
            </el-tag>
            <el-tag :type="detailData.nature === '强制性' ? 'danger' : 'success'">
              {{ detailData.nature }}
            </el-tag>
            <el-tag>{{ detailData.type }}</el-tag>
          </div>
        </div>
      </template>
      <el-descriptions column="2" border :content-style="{ 'padding': '10px 16px' }">
        <el-descriptions-item label="标准编号">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="HITA标准ID">{{ detailData.hitaId }}</el-descriptions-item>
        <el-descriptions-item label="发布机构">{{ detailData.issuingDepartment }}</el-descriptions-item>
        <el-descriptions-item label="发布日期">{{ detailData.recordDate }}</el-descriptions-item>
        <el-descriptions-item label="实施日期">{{ detailData.implementationDate }}</el-descriptions-item>
        <el-descriptions-item label="更新日期">{{ detailData.updateDate }}</el-descriptions-item>
        <el-descriptions-item label="替代标准">{{ detailData.replacementStandard }}</el-descriptions-item>
        <el-descriptions-item label="标准领域">{{ detailData.domain }}</el-descriptions-item>
        <el-descriptions-item label="标准分类">{{ detailData.classification }}</el-descriptions-item>
        <el-descriptions-item label="关键词">{{ detailData.keywords }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 详细内容标签页 -->
    <el-tabs v-model="activeTab" type="card">
      <!-- 标准概述 -->
      <el-tab-pane label="标准概述" name="overview">
        <el-card>
          <h3 class="section-title mb-4">适用范围</h3>
          <p class="mb-6">
            {{ detailData.scope }}
          </p>
          <h3 class="section-title mb-4">标准简介</h3>
          <p>
            {{ detailData.description }}
          </p>
        </el-card>
      </el-tab-pane>

      <!-- 相关标准 -->
      <el-tab-pane label="相关标准" name="related">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="24">
              <h3 class="section-title mb-4">相关标准列表</h3>
              <ul class="related-list">
                <li v-for="(standard, index) in detailData.relatedStandards" :key="index" class="related-item">
                  <el-tag size="small" type="primary" class="mr-2">{{ index + 1 }}</el-tag>
                  {{ standard }}
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>

      <!-- 应用场景 -->
      <el-tab-pane label="应用场景" name="application">
        <el-card>
          <h3 class="section-title mb-4">适用系统</h3>
          <div class="system-tags mb-6">
            <el-tag v-for="(system, index) in detailData.relatedSystems" :key="index" type="success" class="mr-2 mb-2">
              {{ system }}
            </el-tag>
          </div>
          <h3 class="section-title mb-4">应用说明</h3>
          <p>该标准主要应用于医疗卫生领域的信息系统建设，用于规范疾病数据的分类和编码，确保不同系统之间的数据交换和共享。</p>
        </el-card>
      </el-tab-pane>

      <!-- 引用文献 -->
      <el-tab-pane label="引用文献" name="references">
        <el-card>
          <ul class="reference-list">
            <li v-for="(reference, index) in detailData.references" :key="index" class="reference-item">
              <el-tag size="small" type="info" class="mr-2">{{ index + 1 }}</el-tag>
              {{ reference }}
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'overview'
    }
  }
}
</script>

<style scoped>
.standard-detail-page {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  padding: 0 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
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
  align-items: center;
}

.related-item:last-child,
.reference-item:last-child {
  border-bottom: none;
}

.system-tags {
  display: flex;
  flex-wrap: wrap;
}

.fv-breadcrumb {
  padding: 0 16px;
}
</style>