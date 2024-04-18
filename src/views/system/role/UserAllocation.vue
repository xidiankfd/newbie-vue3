<script setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { Minus, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { queryUnUserByRoleIdApi, queryUserByRoleIdApi } from '@/api/system/user'
import { appendApi, cancelBatch } from '@/api/system/user_role'
import usePagingParams from '@/hooks/usePagingParams'

const props = defineProps({
  moduleValue: { type: Boolean, default: false },
  roleId: { type: Number, required: true },
  roleName: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])

const { current, size } = usePagingParams()

const value = computed({
  get() {
    return props.moduleValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const queryFormRef = ref()
const queryFormRef1 = ref()
const tableRef = ref()
const tableRef1 = ref()

const state = reactive({
  // 已分配用户
  queryLoading: false,
  assedTableData: [], // 此角色已分配的用户
  total: 0,
  form: {
    username: '',
    nickName: '',
  },

  // 可分配用户（未分配）
  current: 1,
  size: 10,
  showDialog: false,
  queryLoading1: false,
  assTableData: [], // 此角色可分配的用户
  total1: 0,
  form1: {
    username: '',
    nickName: '',
  },
})
const methods = {
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await queryUserByRoleIdApi(current.value, size.value, props.roleId, toRaw(state.form))
    if (ok) {
      state.assedTableData = data.records
      state.total = data.total
    }

    state.queryLoading = false
  },
  async queryUnData() {
    state.queryLoading1 = true
    const { ok, data } = await queryUnUserByRoleIdApi(state.current, state.size, props.roleId, toRaw(state.form1))
    if (ok) {
      state.assTableData = data.records
      state.total1 = data.total
    }

    state.queryLoading1 = false
  },
  refreshQuery(formEl) {
    formEl && formEl.resetFields()
    methods.queryData()
  },
  refreshQuery1(formEl) {
    formEl && formEl.resetFields()
    methods.queryUnData()
  },
  /** 关联事件 */
  async relevancy(userId) {
    const userIds = []
    if (userId)
      userIds.push(userId)

    else
      tableRef1.value && tableRef1.value.getSelectionRows().forEach(item => userIds.push(item.id))

    if (!userIds.length) {
      ElMessage.warning('请选择用户')
      return
    }

    const { ok } = await appendApi(userIds, [props.roleId])
    if (ok) {
      methods.queryUnData()
      methods.queryData()
    }
  },
  /** 取消关联事件 */
  async remove(userId) {
    const userIds = []
    if (userId)
      userIds.push(userId)

    else
      tableRef.value && tableRef.value.getSelectionRows().forEach(item => userIds.push(item.id))

    if (!userIds.length) {
      ElMessage.warning('请选择用户')
      return
    }

    const { ok } = await cancelBatch(userIds, [props.roleId])
    if (ok) {
      methods.queryData()
      methods.queryUnData()
    }
  },
}
onMounted(() => {
  methods.queryData()
  methods.queryUnData()
})
const columns = [
  { id: 'nickName', label: '昵称', width: '' },
  { id: 'username', label: '用户名', width: '' },
  { id: 'phone', label: '手机号', width: '' },
]
</script>

<template>
  <el-drawer v-model="value" :title="`[${roleName}] 已分配的用户`" direction="rtl" size="60%">
    <el-form ref="queryFormRef" :model="state.form" inline>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="state.form.nickName" @keyup.enter="methods.queryData" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="state.form.username" @keyup.enter="methods.queryData" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="state.queryLoading" :icon="Search" @click="methods.queryData">
          查询
        </el-button>
        <el-button type="warning" :icon="Refresh" :loading="state.queryLoading" @click="methods.refreshQuery(queryFormRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div class="w-full pb-3 flex justify-between">
      <div>
        <el-button type="primary" :icon="Plus" @click="state.showDialog = true">
          分配
        </el-button>
        <el-button type="danger" :icon="Minus" @click="methods.remove(null)">
          取消关联
        </el-button>
      </div>
      <div>
        <el-button :icon="Refresh" circle @click="methods.queryData" />
      </div>
    </div>
    <el-table ref="tableRef" v-loading="state.queryLoading" :data="state.assedTableData" border stripe>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        v-for="col in columns"
        :key="col.id"
        :prop="col.id"
        :label="col.label"
        :width="col.width"
        header-align="center"
      />
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="danger" link @click="methods.remove(row.id)">
            取消关联
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-pagination
        v-model:current-page="current" v-model:page-size="size" class="mt-5" :default-page-size="size"
        :page-sizes="[10, 20, 30, 40, 50, 100]" background layout="->,total,prev, pager, next, jumper,sizes"
        :total="state.total" @current-change="methods.queryData" @size-change="methods.queryData"
      />
    </template>

    <el-dialog
      v-model="state.showDialog"
      :title="`[${roleName}] 未分配的用户`"
      width="60%"
    >
      <el-form ref="queryFormRef1" :model="state.form1" inline>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="state.form1.nickName" @keyup.enter="methods.queryUnData" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="state.form1.username" @keyup.enter="methods.queryUnData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="state.queryLoading" :icon="Search" @click="methods.queryUnData">
            查询
          </el-button>
          <el-button type="warning" :icon="Refresh" :loading="state.queryLoading" @click="methods.refreshQuery1(queryFormRef1)">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <div class="w-full pb-3 flex justify-between">
        <div>
          <el-button type="primary" @click="methods.relevancy(null)">
            一键关联
          </el-button>
        </div>
        <div>
          <el-button :icon="Refresh" circle @click="methods.queryUnData" />
        </div>
      </div>
      <el-table ref="tableRef1" v-loading="state.queryLoading1" :data="state.assTableData" border stripe max-height="300">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          v-for="col in columns"
          :key="col.id"
          :prop="col.id"
          :label="col.label"
          :width="col.width"
          header-align="center"
        />
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="methods.relevancy(row.id)">
              关联
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="state.current" v-model:page-size="state.size" class="mt-5" :default-page-size="state.size"
        :page-sizes="[10, 20, 30, 40, 50, 100]" background layout="->,total,prev, pager, next, jumper,sizes"
        :total="state.total1" @current-change="methods.queryUnData" @size-change="methods.queryUnData"
      />
    </el-dialog>
  </el-drawer>
</template>
