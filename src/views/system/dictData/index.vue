<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Minus, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import DictDataForm from './DictDataForm.vue'
import DictTypeSelect from './DictTypeSelect.vue'
import {
  deleteBatchApi,
  getDictDataListByTypeCodeApi,
  getDictDataPagingApi,
  updateDictDataAsDefaultApi,
} from '@/api/system/dictData'
import usePagingParams from '@/hooks/usePagingParams.js'
import { useAppStore } from '@/stores/modules/app'

defineOptions({
  name: 'SysDictData',
})
const appStore = useAppStore()
const { current, size } = usePagingParams()
const queryFormRef = ref()
const tableRef = ref()
const state = reactive({
  commonStatusList: [],
  eleTypeList: [],
  currentRow: {},
  dialogShow: false,
  tableData: [],
  queryLoading: false,
  total: 0,
  currentDictType: {},
  form: {
    label: '',
    typeId: null,
    status: '',
  },
})
const methods = {
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await getDictDataPagingApi(current.value, size.value, state.form)
    state.tableData = ok ? data.records : []
    state.total = ok ? data.total : 0
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
  onDictTypeChange(v, row) {
    state.form.typeId = v
    state.currentDictType = row
    methods.queryData()
  },
  async updateDictDataAsDefaultApi(row) {
    const { ok } = await updateDictDataAsDefaultApi(row.id)
    ok && methods.queryData()
  },

  async getCommonStatusDict() {
    const { ok, data } = await getDictDataListByTypeCodeApi('commonStatus')
    if (ok)
      state.commonStatusList = data
  },
  async getEleTypeDict() {
    const { ok, data } = await getDictDataListByTypeCodeApi('eleType')
    if (ok)
      state.eleTypeList = data
  },

}
onMounted(() => {
  methods.getCommonStatusDict()
  methods.getEleTypeDict()
})
</script>

<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0">
          <DictTypeSelect @change="methods.onDictTypeChange" />
        </el-col>
        <el-col :span="18" :offset="0">
          <el-card :shadow="appStore.appConfig.elChardShadow">
            <el-form ref="queryFormRef" inline :model="state.form">
              <el-form-item label="标签" prop="label">
                <el-input v-model="state.form.label" placeholder="请输入" clearable @keyup.enter="methods.queryData" />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="state.form.status" placeholder="请选择" clearable style="width: 100px;">
                  <el-option
                    v-for="item in state.commonStatusList" :key="item.value" :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" :loading="state.queryLoading" @click="methods.queryData">
                  查询
                </el-button>
                <el-button
                  type="warning" :icon="Refresh" :loading="state.queryLoading"
                  @click="methods.refreshQuery(queryFormRef)"
                >
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="mt-2" :shadow="appStore.appConfig.elChardShadow">
            <div class="w-full pb-3 flex justify-between">
              <div>
                <el-button v-hasPerm="'sys.dict.data.add'" type="primary" :icon="Plus" @click="methods.openEditForm({})">
                  新增
                </el-button>
                <el-button v-hasPerm="'sys.dict.data.del'" type="danger" :icon="Minus" @click="methods.batchDel(null)">
                  删除
                </el-button>
              </div>
              <div>
                <el-button :icon="Refresh" circle @click="methods.queryData" />
              </div>
            </div>
            <el-table
              ref="tableRef" v-loading="state.queryLoading" :data="state.tableData" border stripe
              height="calc(100vh - 350px)"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="序号" fixed="left" type="index" align="right" header-align="center" width="65px">
                <template #default="{ $index }">
                  {{ (current - 1) * size + $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="label" label="标签" fixed="left" align="left" header-align="center"
                min-width="100px"
              />
              <el-table-column
                prop="value" label="值" fixed="left" align="left" header-align="center"
                min-width="100px"
              />
              <el-table-column prop="sort" label="排序" align="right" header-align="center" width="65px" />

              <el-table-column label="元素类型" align="center" header-align="center" width="120px">
                <template #default="{ row }">
                  <el-tag v-if="row.eleType" :type="state.eleTypeList.find(item => item.value === row.eleType)?.eleType">
                    {{ state.eleTypeList.find(item => item.value === row.eleType)?.label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="元素样式" align="center" header-align="center" width="100px">
                <template #default="{ row }">
                  <div style="display: flex;justify-content: center;">
                    <p :class="row.eleClass" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" header-align="center" width="100px">
                <template #default="{ row }">
                  <el-tag v-if="row.status" :type="state.commonStatusList.find(item => item.value === row.status)?.eleType">
                    {{ state.commonStatusList.find(item => item.value === row.status)?.label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" header-align="center" min-width="200px" />
              <el-table-column prop="createTime" label="创建时间" align="center" width="180px" />
              <el-table-column
                v-hasPerm="['sys.dict.data.update', 'sys.dict.data.del', 'sys.dict.data.def']"
                label="操作" header-align="center" fixed="right" width="170px"
              >
                <template #default="{ row }">
                  <el-button v-hasPerm="'sys.dict.data.update'" type="warning" link @click="methods.openEditForm(row)">
                    编辑
                  </el-button>
                  <el-popconfirm
                    :hide-after="0"
                    :title="`确认要删除【${row.label}】吗？`" @confirm="methods.batchDel(row.id)"
                  >
                    <template #reference>
                      <el-button v-hasPerm="'sys.dict.data.del'" type="danger" link>
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm>
                  <el-button
                    v-if="row.def === 'N'"
                    v-hasPerm="'sys.dict.data.def'" type="success" link
                    @click="methods.updateDictDataAsDefaultApi(row)"
                  >
                    默认
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-model:current-page="current" v-model:page-size="size" class="mt-5"
              :default-page-size="size" :page-sizes="[10, 20, 30, 40, 50, 100]" background
              layout="->,total,prev, pager, next, jumper,sizes" :total="state.total" @current-change="methods.queryData"
              @size-change="methods.queryData"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <DictDataForm
      v-if="state.dialogShow" v-model="state.dialogShow" :row="state.currentRow"
      :ele-type-list="state.eleTypeList" :current-dict-type="state.currentDictType"
      @on-save-success="methods.saveSuccess"
    />
  </el-container>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}

.status-box {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.status-enable {
  background-color: #409eff;
}

.status-disabled {
  background-color: #f56e99;
}
</style>
