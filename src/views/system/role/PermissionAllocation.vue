<script setup>
import { computed, onMounted, reactive } from 'vue'
import { getMenuTreeApi } from '@/api/system/menu'
import SvgIcon from '@/components/svg-icon/index.vue'
import ElTreeList from '@/components/el-tree-list/index.vue'
import { listByRoleId, removeAndSaveByRoleId } from '@/api/system/role_menu'

const props = defineProps({
  moduleValue: { type: Boolean, default: false },
  roleId: { type: String, required: true },
  roleName: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.moduleValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const state = reactive({
  queryLoading: false,
  menuTreeData: [],
  defaultCheckedKeys: [], // 默认勾选的节点的 key 的数组
})
const methods = {
  async onSubmit() {
    await removeAndSaveByRoleId(props.roleId, state.defaultCheckedKeys)
    value.value = false
  },
  async getCheckedKeys() {
    const { ok, data } = await listByRoleId(props.roleId)
    if (ok)
      state.defaultCheckedKeys = data.map(item => item.menuId)
  },
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await getMenuTreeApi()
    if (ok) {
      state.menuTreeData = data
      state.queryLoading = false
    }
  },

}
onMounted(() => {
  methods.queryData()
  methods.getCheckedKeys()
})
const defaultProps = {
  id: 'id',
  label: 'title',
  children: 'children',
}
</script>

<template>
  <el-drawer v-model="value" :title="`[${roleName}] 权限分配`" direction="rtl" size="30%">
    <ElTreeList
      v-model="state.defaultCheckedKeys"
      :data="state.menuTreeData"
      :loading="state.queryLoading"
      :tree-props="defaultProps"
      show-checkbox
      filterable
      default-expand-all
      style="height: 100%;"
    >
      <template #default="{ data }">
        <el-icon v-if="data.icon">
          <SvgIcon :name="data.icon" />
        </el-icon>
        <span class="ml-2">{{ data.title }}</span>
      </template>
    </ElTreeList>
    <template #footer>
      <el-button type="primary" @click="methods.onSubmit">
        提交
      </el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
:deep(.custom-tree-node) {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
:deep(.menu-class){
  color:#409eff;
}
:deep(.but-class){
  color:#67c23a;
}
</style>
