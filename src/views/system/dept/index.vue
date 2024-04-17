<script setup name="Dept">
import { onMounted, reactive, ref } from 'vue'
import { Plus, Refresh, Search, Sort } from '@element-plus/icons-vue'
import useCutTree from 'cut-tree'
import { ElMessage } from 'element-plus'
import DeptForm from './DeptForm.vue'
import { deleteApi, getDeptTreeApi } from '@/api/system/dept'
import { getDictDataListByTypeCodeApi } from '@/api/system/dictData'
import { useAppStore } from '@/stores/modules/app'

defineOptions({
  name: 'Dept',
})
const appStore = useAppStore()
const tableRef = ref()
const queryFormRef = ref()
const { forEach } = useCutTree({ id: 'menuId' })
/** 定义响应式数据 */
const state = reactive({
  commonStatusList: [],
  currentRow: {},
  dialogVisible: false,
  queryLoading: false,
  tableIsExpansionAll: false,
  tableData: [],
  queryForm: {
    deptName: '',
    status: '',
    leader: '',
    phone: '',
  },
})
/** 定义方法 */
const methods = {
  // 查询数据
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await getDeptTreeApi(state.queryForm)
    state.tableData = ok ? data : []
    state.queryLoading = false
  },
  refreshQuery(formEl) {
    formEl && formEl.resetFields()
    methods.queryData()
  },
  // 展开/合并树
  expansionTable() {
    forEach(state.tableData, row => tableRef.value.toggleRowExpansion(row, !state.tableIsExpansionAll))
    state.tableIsExpansionAll = !state.tableIsExpansionAll
  },
  // 递归获取所有子级数据id
  recursionGetdeptIds(depts, deptIds) {
    depts.forEach((dept) => {
      deptIds.push(dept.id)
      if (dept.children?.length)
        methods.recursionGetdeptIds(dept.children, deptIds)
    })
  },
  // 删除点击事件
  onDelClick(row) {
    const deptIds = []
    if (row.children?.length) {
      deptIds.push(row.id)
      methods.recursionGetdeptIds(row.children, deptIds)
    }
    else {
      deptIds.push(row.id)
    }
    methods.delBatch(deptIds)
  },
  // 删除数据及子数据
  async delBatch(deptIds) {
    const { ok } = await deleteApi(deptIds)
    ok && methods.queryData()
  },
  openDeptForm(row) {
    state.currentRow = row
    state.dialogVisible = true
  },
  // 保存成功回调
  onSaveSuccess() {
    state.dialogVisible = false
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
        <el-form ref="queryFormRef" inline :model="state.queryForm">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="state.queryForm.deptName" placeholder="请输入" clearable @keyup.enter="methods.queryData" />
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="state.queryForm.leader" placeholder="请输入" clearable @keyup.enter="methods.queryData" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="state.queryForm.phone" placeholder="请输入" clearable @keyup.enter="methods.queryData" />
          </el-form-item>
          <!-- <el-form-item label="状态" prop="status">
            <el-select v-model="state.queryForm.status" placeholder="请选择" clearable style="width: 100px;">
              <el-option
                v-for="item in state.commonStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
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

      <el-card :shadow="appStore.appConfig.elChardShadow" class="mt-2">
        <div class="w-full pb-3 flex justify-between">
          <div>
            <el-button v-hasPerm="'sys:menu:add'" type="primary" :icon="Plus" @click="methods.openDeptForm({})">
              新增
            </el-button>
            <el-button :icon="Sort" @click="methods.expansionTable">
              {{ state.tableIsExpansionAll ? '合并所有' : '展开所有' }}
            </el-button>
          </div>
          <div>
            <el-button :icon="Refresh" circle @click="methods.queryData" />
          </div>
        </div>
        <el-table
          ref="tableRef" v-loading="state.queryLoading" :data="state.tableData" border stripe row-key="id"
          height="calc(100vh - 300px)"
        >
          <el-table-column
            prop="deptName" label="部门名称" min-width="180px" fixed="left" align="left"
            header-align="center"
          />

          <el-table-column
            prop="leader" label="负责人" show-overflow-tooltip align="left" header-align="center"
            width="120px"
          />
          <el-table-column
            prop="phone" label="联系电话" show-overflow-tooltip align="center" header-align="center"
            width="150px"
          />
          <el-table-column
            prop="email" label="邮箱" align="left" header-align="center" width="200px"
            show-overflow-tooltip
          />
          <el-table-column prop="sort" label="排序" width="70" align="right" header-align="center" />
          <el-table-column label="状态" width="90" align="center" header-align="center">
            <template #default="{ row }">
              <el-tag :type="state.commonStatusList.find(item => item.value === row.status)?.eleType">
                {{ state.commonStatusList.find(item => item.value === row.status)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark" label="描述" width="180" align="left" header-align="center"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="180" align="center" header-align="center" />
          <el-table-column label="操作" min-width="170" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                v-hasPerm="'sys:menu:add'" :disabled="row.type === '0'" type="primary" link
                @click="methods.openDeptForm({ parentId: row.id })"
              >
                新增
              </el-button>
              <el-button v-hasPerm="'sys:menu:edit'" type="warning" link @click="methods.openDeptForm(row)">
                编辑
              </el-button>
              <el-popconfirm :title="`确认要删除【${row.deptName}】吗？`" @confirm="methods.onDelClick(row)">
                <template #reference>
                  <el-button v-hasPerm="'sys:menu:del'" type="danger" link>
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
    <DeptForm
      v-if="state.dialogVisible" v-model="state.dialogVisible" :current-row="state.currentRow"
      @save-success="methods.onSaveSuccess"
    />
  </el-container>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
