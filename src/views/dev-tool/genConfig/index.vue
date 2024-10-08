<template>
  <el-container>
    <el-main>
      <el-card shadow="never">
        <el-form :model="state.queryForm" ref="queryFormRef" inline>
          <el-form-item label="配置名称：" prop="configName">
            <el-input v-model="state.queryForm.configName" />
          </el-form-item>
          <el-form-item label="作者：" prop="author">
            <el-input v-model="state.queryForm.author" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryData" :loading="state.queryLoading" :icon="Search">查询</el-button>
            <el-button type="warning" @click="refreshQuery(queryFormRef)" :loading="state.queryLoading"
              :icon="Refresh">重置</el-button>
            <el-button type="success" @click="handleAddClick" :loading="state.queryLoading" :icon="Plus"
              v-hasPerm="'generator.genConfig.add'">新增</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never" style="margin-top: 20px;">
        <el-table :data="state.tableData" border stripe v-loading="state.queryLoading">
          <el-table-column type="index" width="50" />
          <el-table-column prop="configName" label="配置名称" width="auto" header-align="center" align="left" />
          <el-table-column prop="author" label="作者" width="auto" header-align="center" align="left" show-overflow-tooltip/>
          <el-table-column prop="email" label="邮箱" width="auto" header-align="center" align="left" show-overflow-tooltip/>
          <el-table-column prop="dateFormat" label="日期格式" width="auto" header-align="center" align="left" show-overflow-tooltip/>
          <el-table-column prop="packageParent" label="父级包名" width="auto" header-align="center" align="left" show-overflow-tooltip/>
          <el-table-column prop="moduleName" label="模块名" width="auto" header-align="center" align="left" show-overflow-tooltip/>
          <el-table-column prop="tablePrefix" label="表名前缀" width="100" header-align="center" align="left" show-overflow-tooltip/>
          <el-table-column prop="enableApiAuth" label="接口权限控制" width="120" header-align="center" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableApiAuth === '1' ? 'success' : 'danger'">
                {{ row.enableApiAuth === '1' ? '开启' : '关闭' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enableSpringDoc" label="接口文档" width="120" header-align="center" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableSpringDoc === '1' ? 'success' : 'danger'">
                {{ row.enableSpringDoc === '1' ? '开启' : '关闭' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enableDrawer" label="ui抽屉组件" width="120" header-align="center" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableDrawer === '1' ? 'success' : 'danger'">
                {{ row.enableDrawer === '1' ? '开启' : '关闭' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template #default="{ row }">
              <el-button link type="info" @click="handleDetailClick(row)">详情</el-button>
              <el-button link type="warning" @click="handleEditClick(row)"
                v-hasPerm="'generator.genConfig.update'">编辑</el-button>
              <el-button link type="danger" @click="handleDeleteClick(row)"
                v-hasPerm="'generator.genConfig.delete'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px;" v-model:current-page="state.pageInfo.current"
          v-model:page-size="state.pageInfo.size" :page-sizes="[10, 20, 30, 50]" background
          :default-page-size="state.pageInfo.size" layout="->,total, sizes, prev, pager, next, jumper"
          :total="state.pageInfo.total" @size-change="queryData" @current-change="queryData" />
      </el-card>
    </el-main>
    <GenConfigDataForm ref="dataFormRef" @submit-success="queryData" />
  </el-container>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import GenConfigDataForm from './GenConfigDataForm.vue'
import { pageApi, deleteByPkValApi } from '@/api/dev-tool/genConfig'
import { ElMessageBox } from 'element-plus'

defineOptions({ name: 'GeneratorgenConfigVue' })

/**定义响应式数据 */
const queryFormRef = ref()
const dataFormRef = ref()
const state = reactive({
  queryLoading: false,
  tableData: [], // 表格数据
  // 分页信息
  pageInfo: {
    current: 1,
    size: 10,
    total: 0,
  },
  queryForm: {
    configName: '', // 配置名称
    author: '', // 作者
    email: '', // 邮箱
    dateFormat: '', // 日期格式 yyyy-MM-dd HH:mm:ss
    packageParent: '', // 父级包名 com.newbie
    moduleName: '', // 模块名 system
    tablePrefix: '', // 表名前缀 多个以逗号分割
    enableApiAuth: '', // 接口权限控制，1开启 0关闭
    enableSpringDoc: '', // 接口文档，1开启 0关闭
    enableDrawer: '', // ui抽屉组件，1开启 0关闭
  },
})
/**查询数据 */
function queryData() {
  state.queryLoading = true
  const params = {
    ...state.queryForm,
    current: state.pageInfo.current,
    size: state.pageInfo.size
  }
  pageApi(params).then(res => {
    state.tableData = res.data.records
    state.pageInfo.total = res.data.total
  }).finally(() => {
    state.queryLoading = false
  })
}
/**重置查询条件 */
function refreshQuery(formEl) {
  if (!formEl) return
  formEl.resetFields()
  queryData()
}
/**新增按钮点击事件 */
function handleAddClick() {
  dataFormRef.value && dataFormRef.value.open()
}
/**详情按钮点击事件 */
function handleDetailClick(currRow) {
  dataFormRef.value && dataFormRef.value.open({ ...currRow }, true)
}
/**编辑按钮点击事件 */
function handleEditClick(currRow) {
  dataFormRef.value && dataFormRef.value.open({ ...currRow })
}
/**删除按钮点击事件 */
function handleDeleteClick(currRow) {
  ElMessageBox.confirm(
    '确定要删除此条数据吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteByPkValApi(currRow.id).then(res => {
        queryData()
      })
    })
}
onMounted(() => {
  queryData()
})
</script>

<style scoped></style>