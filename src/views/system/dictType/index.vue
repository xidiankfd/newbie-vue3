<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Minus, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DictTypeForm from './DictTypeForm.vue'
import { deleteBatchApi, getDictTypePagingApi } from '@/api/system/dictType'
import usePagingParams from '@/hooks/usePagingParams.js'
import { getDictDataListByTypeCodeApi } from '@/api/system/dictData'
import { useAppStore } from '@/stores/modules/app'

defineOptions({
  name: 'DictType',
})
const appStore = useAppStore()
const { current, size } = usePagingParams()
const queryFormRef = ref()
const tableRef = ref()
const state = reactive({
  commonStatusList: [],
  currentRow: {},
  dialogShow: false,
  tableData: [],
  queryLoading: false,
  total: 0,
  form: {
    typeName: '',
    typeCode: '',
    status: '',
  },
})
const methods = {
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await getDictTypePagingApi(current.value, size.value, state.form)
    if (ok)
      state.tableData = data.records
    state.total = data.total
    state.queryLoading = false
  },
  refreshQuery(formEl) {
    formEl && formEl.resetFields()
    methods.queryData()
  },
  openEditForm(row) {
    state.currentRow = row
    state.dialogShow = true
  },
  async batchDel(id) {
    if (id || id === 0) {
      const { ok } = await deleteBatchApi([id])
      ok && methods.queryData()
    }
    else {
      const ids = tableRef.value.getSelectionRows().map(item => item.id)
      ElMessageBox.confirm('确认删除选中数据吗?',
        '注意',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          const { ok } = await deleteBatchApi(ids)
          ok && methods.queryData()
        })
    }
  },
  saveSuccess() {
    state.dialogShow = false
    methods.queryData()
  },
  async getCommonStatusDict() {
    const { ok, data } = await getDictDataListByTypeCodeApi('commonStatus')
    if (ok)
      state.commonStatusList = data

    else
      ElMessage.error('获取通用状态字典数据失败')
  },

}
onMounted(() => {
  methods.getCommonStatusDict()
  methods.queryData()
})
</script>

<template>
  <el-container>
    <el-main>
      <el-card :shadow="appStore.appConfig.elChardShadow">
        <el-form ref="queryFormRef" inline :model="state.form">
          <el-form-item label="分类名称" prop="typeName">
            <el-input v-model="state.form.typeName" placeholder="请输入" clearable @keyup.enter="methods.queryData" />
          </el-form-item>
          <el-form-item label="分类编码" prop="typeCode">
            <el-input v-model="state.form.typeCode" placeholder="请输入" clearable @keyup.enter="methods.queryData" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.form.status" placeholder="请选择" clearable style="width: 100px;">
              <el-option
                v-for="item in state.commonStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" :loading="state.queryLoading" @click="methods.queryData">
              查询
            </el-button>
            <el-button type="warning" :icon="Refresh" :loading="state.queryLoading" @click="methods.refreshQuery(queryFormRef)">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="mt-2" :shadow="appStore.appConfig.elChardShadow">
        <div class="w-full pb-3 flex justify-between">
          <div>
            <el-button type="primary" :icon="Plus" @click="methods.openEditForm({})">
              新增
            </el-button>
            <el-button type="danger" :icon="Minus" @click="methods.batchDel(null)">
              删除
            </el-button>
          </div>
          <div>
            <el-button :icon="Refresh" circle @click="methods.queryData" />
          </div>
        </div>
        <el-table ref="tableRef" v-loading="state.queryLoading" :data="state.tableData" border stripe height="calc(100vh - 350px)">
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" fixed="left" type="index" align="right" header-align="center" width="60px">
            <template #default="{ $index }">
              {{ (current - 1) * size + $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="字典分类名称" fixed="left" align="left" header-align="center" min-width="180px" />
          <el-table-column prop="typeCode" label="字典分类编码" fixed="left" align="left" header-align="center" min-width="180px" />
          <el-table-column prop="orderNo" label="排序" align="right" header-align="center" width="80px" />
          <el-table-column label="状态" align="center" header-align="center" width="100px">
            <template #default="{ row }">
              <el-tag :type="state.commonStatusList.find(item => item.value === row.status)?.eleType">
                {{ state.commonStatusList.find(item => item.value === row.status)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" header-align="center" min-width="200px" />
          <el-table-column prop="createTime" label="创建时间" align="center" width="180px" />
          <el-table-column label="操作" align="center" fixed="right" width="170px">
            <template #default="{ row }">
              <el-button type="warning" link @click="methods.openEditForm(row)">
                编辑
              </el-button>
              <el-popconfirm :title="`确认要删除【${row.typeName}】吗？`" @confirm="methods.batchDel(row.id)">
                <template #reference>
                  <el-button type="danger" link>
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="current"
          v-model:page-size="size"
          class="mt-5"
          :default-page-size="size"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          background
          layout="->,total,prev, pager, next, jumper,sizes"
          :total="state.total"
          @current-change="methods.queryData"
          @size-change="methods.queryData"
        />
      </el-card>
    </el-main>
    <DictTypeForm
      v-if="state.dialogShow" v-model="state.dialogShow" :row="state.currentRow"
      @on-save-success="methods.saveSuccess"
    />
  </el-container>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
