<script setup name="User">
import { onMounted, reactive, ref } from 'vue'
import { Minus, Plus, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import UserForm from './UserForm.vue'
import UpdateUserPassword from './UpdateUserPassword.vue'
import { deleteBatchApi, getUserPaging } from '@/api/system/user'
import { getDeptTreeApi } from '@/api/system/dept'
import ElTreeList from '@/components/el-tree-list/index.vue'
import usePagingParams from '@/hooks/usePagingParams'
import { getDictDataListByTypeCodeApi } from '@/api/system/dictData'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
const { current, size } = usePagingParams()
const tableRef = ref()
/** 定义响应式变量 */
const state = reactive({
  showUpdatePasswordDialog: false,
  userGenderList: [],
  userStatusList: [],
  rawDeptTree: [],
  deptTree: [],
  currentRow: {},
  showDialog: false,
  queryLoading: false,
  deptLoading: false,
  total: 0,
  tableData: [],
  queryForm: {
    deptId: '',
    nickName: '',
    username: '',
  },
})
/** 定义方法 */
const methods = {
  openUpdatePasswordDialog(row) {
    state.currentRow = row
    state.showUpdatePasswordDialog = true
  },

  // 初始化部门数据
  async initDeptTree() {
    state.deptLoading = true
    const { ok, data } = await getDeptTreeApi()
    if (!ok) {
      state.deptLoading = false
      return
    }
    state.rawDeptTree = data
    state.deptTree = [
      {
        deptName: '全部',
        id: '',
      },
      ...data,
    ]
    state.deptLoading = false
  },
  // 查询数据
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await getUserPaging(current.value, size.value, state.queryForm)
    state.tableData = ok ? data.records : []
    state.total = ok ? data.total : 0
    state.queryLoading = false
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
  openUserForm(row) {
    state.currentRow = row || {}
    state.showDialog = true
  },
  saveSuccess() {
    state.showDialog = false
    methods.queryData()
  },
  /** 查询字典 */
  async getUserStatusDict() {
    // 用户状态
    const { ok, data } = await getDictDataListByTypeCodeApi('userStatus')
    if (ok)
      state.userStatusList = data
  },
  async getUserGenderDict() {
    const { ok, data } = await getDictDataListByTypeCodeApi('userGender')
    if (ok)
      state.userGenderList = data
  },
}
onMounted(() => {
  methods.initDeptTree()
  methods.getUserStatusDict()
  methods.getUserGenderDict()
  methods.queryData()
})
</script>

<template>
  <el-main style="overflow: hidden;height: 100%;">
    <el-row :gutter="20" style="height: 100%;">
      <el-col :span="4" :offset="0" style="height: 100%;">
        <ElTreeList
          v-model="state.queryForm.deptId"
          style="height: 100%;"
          :data="state.deptTree" :tree-props="{ id: 'id', label: 'deptName' }" filterable
          title="部门" height="100%" header-height="50px" :loading="state.deptLoading"
          @node-click="methods.queryData"
        />
      </el-col>
      <el-col :span="20" :offset="0">
        <el-card :shadow="appStore.appConfig.elChardShadow">
          <el-form inline>
            <el-row :gutter="20">
              <el-col :span="6" :offset="0">
                <el-form-item label="昵称" class="w-full">
                  <el-input v-model="state.queryForm.nickName" placeholder="请输入" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-form-item label="用户名" class="w-full">
                  <el-input v-model="state.queryForm.username" placeholder="请输入" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-form-item>
                  <el-button type="primary" :icon="Search" :loading="state.queryLoading" @click="methods.queryData">
                    查询
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>

        <el-card :shadow="appStore.appConfig.elChardShadow" class="mt-2">
          <div class="w-full pb-3 flex justify-between">
            <div>
              <el-button v-hasPerm="'sys.user.add'" type="primary" :icon="Plus" @click="methods.openUserForm">
                新增
              </el-button>
              <el-button v-hasPerm="'sys.user.del'" type="danger" :icon="Minus" @click="methods.batchDel(null)">
                删除
              </el-button>
            </div>
            <div>
              <el-button :icon="Refresh" circle @click="methods.queryData" />
            </div>
          </div>
          <el-table
            ref="tableRef"
            v-loading="state.queryLoading" :data="state.tableData" border stripe row-key="menuId"
            height="calc(100vh - 343px)"
          >
            <el-table-column type="selection" width="50" align="center" fixed="left" />
            <el-table-column label="序号" fixed="left" type="index" align="right" header-align="center" width="65px">
              <template #default="{ $index }">
                {{ (current - 1) * size + $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="nickName" label="昵称" header-align="center" width="120px" fixed="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="username" label="用户名" header-align="center" width="120px" fixed="left"
              show-overflow-tooltip
            />

            <!-- <el-table-column prop="avatar" label="头像" align="center">
              <template #default="{ row }">
                <el-image
                  class="avatar"
                  :src="row.avatar"
                  :preview-src-list="[row.avatar]"
                  preview-teleported
                />
              </template>
</el-table-column> -->
            <el-table-column prop="phone" label="手机号" align="center" width="150px" />
            <el-table-column prop="email" label="邮箱" header-align="center" min-width="160px" show-overflow-tooltip />
            <el-table-column prop="gender" label="性别" align="center" width="100px">
              <template #default="{ row }">
                <el-tag :type="state.userGenderList.find(item => item.value === row.gender)?.eleType || ''">
                  {{ state.userGenderList.find(item => item.value === row.gender)?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="100px">
              <template #default="{ row }">
                <el-tag :type="state.userStatusList.find(item => item.value === row.status)?.eleType || ''">
                  {{ state.userStatusList.find(item => item.value === row.status)?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" align="right" header-align="center" width="80px" />
            <el-table-column
              v-hasPerm="['sys.user.update', 'sys.user.del', 'sys.user.update.password']"
              label="操作" align="center" width="200px" fixed="right"
            >
              <template #default="{ row }">
                <el-button v-hasPerm="'sys.user.update'" type="warning" link @click="methods.openUserForm(row)">
                  编辑
                </el-button>
                <el-popconfirm
                  :hide-after="0" :title="`确认要删除 ${row.username} 吗？`" @confirm="methods.batchDel(row.id)"
                >
                  <template #reference>
                    <el-button v-hasPerm="'sys.user.del'" type="danger" link>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button v-hasPerm="'sys.user.update.password'" type="info" link @click="methods.openUpdatePasswordDialog(row)">
                  修改密码
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="current" v-model:page-size="size" class="mt-5" :default-page-size="size"
            :page-sizes="[10, 20, 30, 40, 50, 100]" background layout="->,total,prev, pager, next, jumper,sizes"
            :total="state.total" @current-change="methods.queryData" @size-change="methods.queryData"
          />
        </el-card>
      </el-col>
    </el-row>
    <UpdateUserPassword v-if="state.showUpdatePasswordDialog" v-model="state.showUpdatePasswordDialog" :row="state.currentRow" />
    <UserForm
      v-if="state.showDialog" v-model="state.showDialog" :row="state.currentRow"
      :user-gender-list="state.userGenderList"
      :user-status-list="state.userStatusList"
      @on-save-success="methods.saveSuccess"
    />
  </el-main>
</template>

<style scoped>
.avatar {
  width: 80px;
  height: 80px;
}

.el-form-item {
  margin-bottom: 0;
}
</style>
