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
  form: {
    roleName: '',
    roleCode: '',
    orderNo: 1,
    status: '1',
    description: '',
  },
})
/** 抽屉标题 */
const title = computed(() => {
  if (props.row.roleId || props.row.roleId === 0)
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
        const { ok } = await saveRoleApi(state.form)
        ok && emit('onSaveSuccess')
      }
    })
  },

  // 排序焦点离开事件
  onOrderNoBlur() {
    if (!state.form.orderNo)
      state.form.orderNo = 0
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
  if (props.row.roleId || props.row.roleId === 0)
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
      <el-form-item label="描述" prop="description">
        <el-input v-model="state.form.description" type="textarea" placeholder="描述" :maxlength="120" show-word-limit :rows="4" />
      </el-form-item>
      <el-form-item label="排序" prop="orderNo">
        <el-input-number
          v-model="state.form.orderNo"
          controls-position="right"
          @blur="methods.onOrderNoBlur"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="state.form.status" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="methods.submit(formRef)">
        提交
      </el-button>
      <el-button @click="methods.resetForm(formRef)">
        重置
      </el-button>
    </template>
  </el-dialog>
</template>
