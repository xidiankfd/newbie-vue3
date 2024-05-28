<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { saveDictTypeApi } from '@/api/system/dictType'

const props = defineProps({
  row: { type: Object, default: () => {} },
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['onSaveSuccess', 'update:modelValue'])

const formRef = ref()
/** 定义响应式变量 */
const state = reactive({
  saveLoading: false,
  menuTreeLoading: false,
  menuTree: [],
  form: {
    id: props.row.id || null,
    typeName: props.row.typeName || '',
    typeCode: props.row.typeCode || '',
    sort: props.row.sort || props.row.sort === 0 ? props.row.sort : 1,
    status: props.row.status || '1',
    remark: props.row.remark || '',
  },
})
/** 标题 */
const title = computed(() => {
  if (props.row.id)
    return '修改字典'
  else
    return '新增字典'
})

const dialogShow = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

/** 定义方法 */
const methods = {
  // 提交
  async submit(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid) => {
      if (valid) {
        state.saveLoading = true
        const { ok } = await saveDictTypeApi(state.form)
        state.saveLoading = false
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
  typeName: [
    { required: true, message: '请输入字典分类名称', trigger: 'blur' },
  ],
  typeCode: [
    { required: true, message: '请输入字典分类编码', trigger: 'blur' },
  ],
}
onMounted(() => {

})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="title"
    width="35%"
  >
    <el-form ref="formRef" :model="state.form" :rules="rules" label-width="80px">
      <el-form-item label="分类名称" prop="typeName">
        <el-input v-model="state.form.typeName" placeholder="字典分类名称" />
      </el-form-item>
      <el-form-item label="分类编码" prop="typeCode">
        <el-input v-model="state.form.typeCode" placeholder="字典分类编码" :disabled="!!row.id || row.id === 0" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="state.form.remark" type="textarea" placeholder="备注" :maxlength="120" show-word-limit :rows="4" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="state.form.sort"
          controls-position="right"
          :value-on-clear="1"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="state.form.status" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" :loading="state.saveLoading" @click="methods.submit(formRef)">
        提交
      </el-button>
      <el-button @click="methods.resetForm(formRef)">
        重置
      </el-button>
    </template>
  </el-dialog>
</template>
