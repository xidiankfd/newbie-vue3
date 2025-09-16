<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElCard, ElCollapse, ElCollapseItem, ElDescriptions, ElTabPane, ElTable, ElTableColumn, ElTabs, ElTag }
  from 'element-plus'
// import { Terminal } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const standardId = route.query.id

// 模拟应用支持数据
const standardInfo = ref({
  id: 'GB/T 14396-2016',
  name: '疾病分类与代码',
  version: '2016',
})

// API接口列表
const apiList = ref([
  {
    id: 'API001',
    name: '疾病编码查询',
    method: 'GET',
    url: '/api/standard/disease/code/query',
    description: '根据疾病名称或编码查询疾病信息',
    status: '可用',
    version: 'v1.0',
  },
  {
    id: 'API002',
    name: '疾病编码批量查询',
    method: 'POST',
    url: '/api/standard/disease/code/batch',
    description: '批量查询疾病编码信息',
    status: '可用',
    version: 'v1.0',
  },
  {
    id: 'API003',
    name: '疾病编码验证',
    method: 'GET',
    url: '/api/standard/disease/code/validate',
    description: '验证疾病编码是否符合标准',
    status: '开发中',
    version: 'v1.1',
  },
  {
    id: 'API004',
    name: '疾病分类统计',
    method: 'GET',
    url: '/api/standard/disease/category/stats',
    description: '获取疾病分类统计数据',
    status: '可用',
    version: 'v1.0',
  },
])

// SDK工具列表
const sdkTools = ref([
  {
    id: 'SDK001',
    name: 'Java SDK',
    version: '1.2.0',
    language: 'Java',
    framework: 'Spring Boot',
    description: 'Java语言开发的疾病分类与代码SDK',
    downloadUrl: '/download/sdk/java/1.2.0',
    documentUrl: '/docs/sdk/java/1.2.0',
  },
  {
    id: 'SDK002',
    name: 'JavaScript SDK',
    version: '1.1.0',
    language: 'JavaScript',
    framework: 'Node.js',
    description: 'JavaScript语言开发的疾病分类与代码SDK',
    downloadUrl: '/download/sdk/js/1.1.0',
    documentUrl: '/docs/sdk/js/1.1.0',
  },
  {
    id: 'SDK003',
    name: 'Python SDK',
    version: '1.0.0',
    language: 'Python',
    framework: 'None',
    description: 'Python语言开发的疾病分类与代码SDK',
    downloadUrl: '/download/sdk/python/1.0.0',
    documentUrl: '/docs/sdk/python/1.0.0',
  },
])

// 示例代码
const exampleCode = ref(`// Java示例代码
import com.hita.standard.disease.CodeService;
import com.hita.standard.disease.model.DiseaseInfo;

public class DiseaseCodeExample {
    public static void main(String[] args) {
        // 初始化代码服务
        CodeService codeService = new CodeService("your-api-key");
        
        try {
            // 根据编码查询疾病信息
            DiseaseInfo info = codeService.getDiseaseByCode("A01");
            System.out.println("疾病名称：" + info.getName());
            System.out.println("疾病分类：" + info.getCategory());
            
            // 验证疾病编码
            boolean isValid = codeService.validateCode("A01.0");
            System.out.println("编码是否有效：" + isValid);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`)

// 常见问题
const faqs = ref([
  {
    question: '如何获取API访问密钥？',
    answer: '请访问HITA标准服务平台的开发者中心，注册账号并申请API密钥。申请通过后，您将收到API访问密钥，用于调用标准资源的API接口。',
  },
  {
    question: 'SDK支持哪些编程语言和框架？',
    answer: '目前我们支持Java、JavaScript和Python三种编程语言的SDK。其中Java SDK主要支持Spring Boot框架，JavaScript SDK支持Node.js环境，Python SDK不依赖特定框架。',
  },
  {
    question: 'API调用有哪些限制？',
    answer: '根据您的账号类型和服务等级，API调用会有不同的限制。免费用户每分钟最多可调用100次API，付费用户可根据套餐享受更高的调用额度。详细限制请参考开发者文档中的API调用限制说明。',
  },
  {
    question: '如何处理API调用返回的错误？',
    answer: 'API调用返回的错误信息包含错误码和错误描述。您可以参考API文档中的错误码说明，了解具体错误原因并进行相应处理。常见错误包括参数错误、权限不足、服务器繁忙等。',
  },
  {
    question: '标准内容更新后，如何获取最新版本？',
    answer: '标准内容更新后，我们会通过邮件、短信等方式通知订阅用户。您也可以定期访问HITA标准服务平台，查看标准资源的更新状态。SDK工具会在新版本发布后同步更新，您可以通过开发者中心下载最新版本的SDK。',
  },
])

// 应用场景
const applicationScenarios = ref([
  {
    scenario: '医院信息系统集成',
    description: '将疾病分类与代码标准集成到医院信息系统中，用于患者诊断、治疗记录和医疗统计等场景。',
  },
  {
    scenario: '电子病历系统建设',
    description: '在电子病历系统中使用标准疾病编码，确保病历数据的标准化和互操作性。',
  },
  {
    scenario: '医疗统计分析',
    description: '基于标准疾病分类进行医疗数据统计和分析，为医疗管理和决策提供支持。',
  },
  {
    scenario: '医保支付审核',
    description: '在医保支付审核过程中，使用标准疾病编码进行医疗费用的审核和结算。',
  },
])

onMounted(() => {
  // 实际项目中这里应该根据standardId调用API获取数据
  console.log('获取标准应用支持信息，ID:', standardId)
})

// 返回数字化内容页面
function goBack() {
  router.push({ path: '/standardResource/digitalContent', query: { id: standardId } })
}

// 查看详情
function viewDetail() {
  router.push({ path: '/standardResource/detail', params: { id: standardId } })
}
</script>

<script>
export default {
  data() {
    return {
      activeTab: 'api',
      activeFaq: ['0'],
    }
  },
}
</script>

<template>
  <div class="application-support-page">
    <!-- 面包屑导航 -->
    <div class="fv-breadcrumb mb-4">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="$router.push('/standardResource')">
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item @click="$router.push('/standardResource')">
          标准文件
        </el-breadcrumb-item>
        <el-breadcrumb-item @click="viewDetail">
          {{ standardInfo.name }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>应用支持</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons mb-4">
      <ElButton @click="goBack">
        返回
      </ElButton>
    </div>

    <!-- 应用支持标签页 -->
    <ElTabs v-model="activeTab" type="card">
      <!-- API接口 -->
      <ElTabPane label="API接口" name="api">
        <ElCard>
          <ElTable :data="apiList" border stripe style="width: 100%">
            <ElTableColumn prop="id" label="API ID" width="100" />
            <ElTableColumn prop="name" label="接口名称" width="180" />
            <ElTableColumn prop="method" label="请求方法" width="100">
              <template #default="{ row }">
                <ElTag size="small" :type="row.method === 'GET' ? 'success' : 'warning'">
                  {{ row.method }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="url" label="接口地址" min-width="200" />
            <ElTableColumn prop="description" label="接口描述" min-width="250" />
            <ElTableColumn prop="status" label="状态" width="80">
              <template #default="{ row }">
                <ElTag size="small" :type="row.status === '可用' ? 'success' : 'info'">
                  {{ row.status }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="version" label="版本" width="80" />
            <ElTableColumn label="操作" width="100">
              <template #default>
                <ElButton type="primary" link size="small" icon="ExternalLink">
                  文档
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCard>
      </ElTabPane>

      <!-- SDK工具 -->
      <ElTabPane label="SDK工具" name="sdk">
        <ElCard>
          <div class="sdk-list">
            <div v-for="(sdk, index) in sdkTools" :key="index" class="sdk-item">
              <div class="sdk-header">
                <div class="sdk-title">
                  <CodeIcon class="sdk-icon" />
                  {{ sdk.name }}
                </div>
                <div class="sdk-actions">
                  <ElButton size="small" type="primary" icon="Download">
                    下载
                  </ElButton>
                  <ElButton size="small" icon="BookOpen">
                    文档
                  </ElButton>
                </div>
              </div>
              <ElDescriptions column="4" size="small" :content-style="{ padding: '8px 16px' }">
                <el-descriptions-item label="版本">
                  {{ sdk.version }}
                </el-descriptions-item>
                <el-descriptions-item label="语言">
                  {{ sdk.language }}
                </el-descriptions-item>
                <el-descriptions-item label="框架">
                  {{ sdk.framework }}
                </el-descriptions-item>
                <el-descriptions-item label="描述">
                  {{ sdk.description }}
                </el-descriptions-item>
              </ElDescriptions>
            </div>
          </div>
        </ElCard>
      </ElTabPane>

      <!-- 使用示例 -->
      <ElTabPane label="使用示例" name="examples">
        <ElCard>
          <div class="examples-container">
            <div class="example-header">
              <Terminal class="example-icon" />
              <h3 class="example-title">
                Java示例代码
              </h3>
            </div>
            <ElCode class="example-code">
              {{ exampleCode }}
            </ElCode>
          </div>
        </ElCard>
      </ElTabPane>

      <!-- 常见问题 -->
      <ElTabPane label="常见问题" name="faqs">
        <ElCard>
          <ElCollapse v-model="activeFaq">
            <ElCollapseItem
              v-for="(faq, index) in faqs"
              :key="index"
              :title="faq.question"
              :name="index.toString()"
            >
              <div class="faq-answer">
                {{ faq.answer }}
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </ElCard>
      </ElTabPane>

      <!-- 应用场景 -->
      <ElTabPane label="应用场景" name="scenarios">
        <ElCard>
          <div class="scenarios-container">
            <div v-for="(scenario, index) in applicationScenarios" :key="index" class="scenario-item">
              <div class="scenario-header">
                <span class="scenario-number">{{ index + 1 }}</span>
                <h3 class="scenario-title">
                  {{ scenario.scenario }}
                </h3>
              </div>
              <p class="scenario-description">
                {{ scenario.description }}
              </p>
            </div>
          </div>
        </ElCard>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped>
.application-support-page {
  padding: 16px;
}

.action-buttons {
  padding: 0 16px;
}

.sdk-list {
  padding: 16px;
}

.sdk-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}

.sdk-item:last-child {
  margin-bottom: 0;
}

.sdk-header {
  background-color: #f5f7fa;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.sdk-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.sdk-icon {
  margin-right: 8px;
}

.sdk-actions {
  display: flex;
  gap: 8px;
}

.examples-container {
  padding: 16px;
}

.example-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.example-icon {
  margin-right: 8px;
  color: #606266;
}

.example-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.example-code {
  background-color: #f8f8f8;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
  overflow-x: auto;
}

.faq-answer {
  padding: 8px 0;
  color: #606266;
  line-height: 1.8;
}

.scenarios-container {
  padding: 16px;
}

.scenario-item {
  padding: 16px 0;
  border-bottom: 1px dashed #ebeef5;
}

.scenario-item:last-child {
  border-bottom: none;
}

.scenario-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.scenario-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
}

.scenario-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.scenario-description {
  margin: 0;
  color: #606266;
  line-height: 1.8;
  padding-left: 36px;
}

.fv-breadcrumb {
  padding: 0 16px;
}
</style>
