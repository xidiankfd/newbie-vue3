<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { saveRoleApi } from '@/api/system/role'

const props = defineProps({
  row: { type: Object, default: () => {} },
})
const emit = defineEmits(['onSaveSuccess'])

const formRef = ref()
/** 定义响应式变量 */
const state = reactive({
  loading: false,
  form: {
    roleName: '',
    roleCode: '',
    homePath: '',
    sort: 1,
    status: '1',
    remark: '',
  },
})
/** 抽屉标题 */
const title = computed(() => {
  if (props.row.id || props.row.id === 0)
    return '修改角色'
  else
    return '新增角色'
})
/** 定义方法 */
const methods = {
  // 提交
  async submit(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid) => {
      if (valid) {
        state.loading = true
        const { ok } = await saveRoleApi(state.form)
        state.loading = false
        ok && emit('onSaveSuccess')
      }
    })
  },

  // 重置表单
  resetForm(formEl) {
    if (!formEl)
      return
    formEl.resetFields()
  },
}
const rules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
  ],
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
  ],
}
onMounted(() => {
  if (props.row.id || props.row.id === 0)
    state.form = { ...props.row }
})
</script>

<template>
  <el-dialog
    v-model="state.dialogShow"
    :title="title"
    width="30%"
  >
    <el-form ref="formRef" :model="state.form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="state.form.roleName" placeholder="角色名称" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="state.form.roleCode" placeholder="角色编码" />
      </el-form-item>
      <el-form-item label="首页地址" prop="homePath">
        <el-input v-model="state.form.homePath" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="state.form.remark" type="textarea" placeholder="描述" :maxlength="120" show-word-limit :rows="4" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="state.form.sort"
          :value-on-clear="1"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="state.form.status" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :loading="state.loading" @click="methods.submit(formRef)">
        提交
      </el-button>
      <el-button @click="methods.resetForm(formRef)">
        重置
      </el-button>
    </template>
  </el-dialog>
</template>
