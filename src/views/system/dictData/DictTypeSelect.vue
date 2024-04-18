<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import SvgIcon from '@/components/svg-icon/index.vue'
import router from '@/router'
import usePagingParams from '@/hooks/usePagingParams.js'
import { getDictTypePagingApi, saveDictTypeApi } from '@/api/system/dictType'
import { useAppStore } from '@/stores/modules/app'

const emit = defineEmits(['change'])
const appStore = useAppStore()
const { current, size } = usePagingParams()
const tableRef = ref()
const state = reactive({
  tableData: [],
  queryLoading: false,
  keyword: '',
  total: 0,
})
const methods = {
  onDictTypeManageClick() {
    router.push('/system/dict/type')
  },
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await getDictTypePagingApi(current.value, size.value, { typeName: state.keyword })
    if (ok) {
      state.tableData = data.records
      state.total = data.total

      // 默认选中第一行
      if (data.records?.length > 0 && tableRef.value) {
        tableRef.value.setCurrentRow(data.records[0])
        methods.onRowClick(data.records[0])
      }
    }
    state.queryLoading = false
  },
  onRowClick(row) {
    emit('change', row.id, row)
  },
  async onUpdateDictTypeName(row) {
    const { ok } = await saveDictTypeApi(row)
    if (ok)
      row.edit = false
  },
}
onMounted(() => {
  methods.queryData()
})
</script>

<template>
  <el-card :shadow="appStore.appConfig.elChardShadow">
    <template #header>
      <div style="display:flex;">
        <el-input
          v-model="state.keyword" placeholder="类型名称" clearable
          @keyup.enter="methods.queryData"
        />
        <el-button :loading="state.queryLoading" type="primary" plain :icon="Search" class="ml-2" @click="methods.queryData" />
        <el-button v-hasPerm="'sys.dict.type'" type="primary" link @click="methods.onDictTypeManageClick">
          管理
        </el-button>
      </div>
    </template>
    <el-table
      ref="tableRef"
      v-loading="state.queryLoading"
      highlight-current-row
      :show-header="false"
      height="calc(100vh - 295px)"
      :data="state.tableData"
      @row-click="methods.onRowClick"
    >
      <el-table-column prop="typeName" label="字典类型">
        <template #default="{ row }">
          <el-input v-if="row.edit" v-model="row.typeName" />
          <span v-else>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-hasPerm="'sys.dict.type.update'" label="操作" fixed="right" width="60">
        <template #default="{ row }">
          <el-button v-if="row.edit" type="primary" size="default" link @click="methods.onUpdateDictTypeName(row)">
            <template #icon>
              <el-icon>
                <SvgIcon name="AntDesignCheckOutlined" />
              </el-icon>
            </template>
          </el-button>
          <el-button v-else type="primary" size="default" link @click="row.edit = true">
            <template #icon>
              <el-icon>
                <SvgIcon name="AntDesignEditOutlined" />
              </el-icon>
            </template>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="current"
      v-model:page-size="size"
      :default-page-size="size"
      class="mt-5"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      layout="->,total,prev, pager, next"
      :total="state.total"
      @current-change="methods.queryData"
      @size-change="methods.queryData"
    />
  </el-card>
</template>
