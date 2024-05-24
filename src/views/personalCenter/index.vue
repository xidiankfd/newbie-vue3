<script setup>
import { onMounted, reactive } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import usePagingParams from '@/hooks/usePagingParams'
import { logLoginPagingApi } from '@/api/system/log_login'

defineOptions({
  name: 'PersonalCenter',
})
const { current, size } = usePagingParams()
const appStore = useAppStore()

const state = reactive({
  queryLoading: false,
  tableData: [],
  total: 0,
})
const methods = {
  // 查询数据
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await logLoginPagingApi({ ...state.queryForm, current: current.value, size: size.value })
    state.tableData = ok ? data.records : []
    state.total = ok ? data.total : 0
    state.queryLoading = false
  },
}
onMounted(() => {
  methods.queryData()
})
</script>

<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="8" :offset="0">
        <el-card :shadow="appStore.appConfig.elChardShadow">
          <template #header>
            <div>
              <span>基本信息</span>
            </div>
          </template>
          ------
        </el-card>
      </el-col>
      <el-col :span="16" :offset="0">
        <el-card :shadow="appStore.appConfig.elChardShadow">
          <template #header>
            <div>
              <span>登录日志</span>
            </div>
          </template>
          <el-table
            v-loading="state.queryLoading" :data="state.tableData" border stripe
            height="calc(100vh - 290px)"
          >
            <el-table-column label="序号" fixed="left" type="index" align="right" header-align="center" width="65px">
              <template #default="{ $index }">
                {{ (current - 1) * size + $index + 1 }}
              </template>
            </el-table-column>
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
          </el-table>
          <el-pagination
            v-model:current-page="current" v-model:page-size="size" class="mt-5" :default-page-size="size"
            :page-sizes="[10, 20, 30, 40, 50, 100]" background layout="->,total,prev, pager, next, jumper,sizes"
            :total="state.total" @current-change="methods.queryData" @size-change="methods.queryData"
          />
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>
