<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Minus, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { deleteBatchApi, deleteBeforeDataApi, logLoginPagingApi } from '@/api/system/log_login'
import { useAppStore } from '@/stores/modules/app'
import usePagingParams from '@/hooks/usePagingParams'

defineOptions({
  name: 'SysLogLogin',
})
const { current, size } = usePagingParams()
const appStore = useAppStore()
const tableRef = ref()
const queryFormRef = ref()
const statusList = [
  { value: '1', label: '正常' },
  { value: '0', label: '失败' },
]

/** 定义响应式数据 */
const state = reactive({
  queryLoading: false,
  tableData: [],
  total: 0,
  queryForm: {
    username: '',
    status: '',
  },
})
/** 定义方法 */
const methods = {
  // 查询数据
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await logLoginPagingApi({ ...state.queryForm, current: current.value, size: size.value })
    state.tableData = ok ? data.records : []
    state.total = ok ? data.total : 0
    state.queryLoading = false
  },
  refreshQuery(formEl) {
    formEl && formEl.resetFields()
    methods.queryData()
  },

  // 批量删除
  async delBatch(id) {
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
  async deleteBeforeData() {
    ElMessageBox.confirm('确认清除7天前所有数据吗?',
      '注意',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(async () => {
        const { ok } = await deleteBeforeDataApi(7)
        ok && methods.queryData()
      })
  },
}
onMounted(() => {
  methods.queryData()
})
</script>

<template>
  <el-container>
    <el-main>
      <el-card :shadow="appStore.appConfig.elChardShadow">
        <el-form ref="queryFormRef" inline :model="state.queryForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="state.queryForm.username" placeholder="请输入" clearable @keyup.enter="methods.queryData" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.queryForm.status" placeholder="请选择" clearable style="width: 100px;">
              <el-option
                v-for="item in statusList"
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

      <el-card :shadow="appStore.appConfig.elChardShadow" class="mt-2">
        <div class="w-full pb-3 flex justify-between">
          <div>
            <el-button v-hasPerm="'sys.log.login.del'" type="danger" :icon="Minus" @click="methods.delBatch(null)">
              删除
            </el-button>
            <el-button v-hasPerm="'sys.log.login.del'" type="info" @click="methods.deleteBeforeData">
              <template #icon>
                <el-icon>
                  <svg-icon name="MaterialSymbolsAutoDeleteOutline" />
                </el-icon>
              </template>
              清除7天前数据
            </el-button>
          </div>
          <div>
            <el-button :icon="Refresh" circle @click="methods.queryData" />
          </div>
        </div>
        <el-table
          ref="tableRef" v-loading="state.queryLoading" :data="state.tableData" border stripe row-key="id"
          height="calc(100vh - 350px)"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            prop="username" label="用户名" min-width="120px" fixed="left" align="left"
            header-align="center"
          />
          <el-table-column
            prop="loginIp" label="IP" align="center" header-align="center"
            width="120px"
          />
          <el-table-column
            prop="loginType" label="登入/登出" show-overflow-tooltip align="center" header-align="center"
            min-width="100px"
          >
            <template #default="{ row }">
              <el-tag :type="row.loginType === '1' ? 'success' : 'warning'">
                {{ row.loginType === '1' ? '登入' : '登出' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="loginMethod" label="登录方式" align="left" header-align="center" width="100px"
          />

          <el-table-column
            prop="costTime" label="请求耗时" align="left" header-align="center" min-width="100px"
          />
          <el-table-column label="状态" width="90" align="center" header-align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '1' ? 'primary' : 'danger'">
                {{ row.status === '1' ? '正常' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="failReason" label="失败原因" show-overflow-tooltip align="left" header-align="center"
            min-width="200px"
          />
          <el-table-column
            prop="browser" label="浏览器信息" width="180" align="left" header-align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="os" label="操作系统" align="left" header-align="center" min-width="220px"
            show-overflow-tooltip
          />
          <el-table-column prop="createTime" label="创建时间" width="180" align="center" header-align="center" />
          <el-table-column
            v-hasPerm="['sys.log.login.del']"
            label="操作" min-width="100" align="center" fixed="right"
          >
            <template #default="{ row }">
              <el-popconfirm
                :hide-after="0" title="确认要删除该日志吗？" @confirm="methods.delBatch(row.id)"
              >
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
          v-model:current-page="current" v-model:page-size="size" class="mt-5" :default-page-size="size"
          :page-sizes="[10, 20, 30, 40, 50, 100]" background layout="->,total,prev, pager, next, jumper,sizes"
          :total="state.total" @current-change="methods.queryData" @size-change="methods.queryData"
        />
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
