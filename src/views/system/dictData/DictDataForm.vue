<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { saveDictDataApi } from '@/api/system/dictData'

const props = defineProps({
  row: { type: Object, default: () => {} },
  currentDictType: { type: Object, default: () => {} },
  modelValue: { type: Boolean, default: false },
  eleTypeList: { type: Array, required: true },
})
const emit = defineEmits(['onSaveSuccess', 'update:modelValue'])

const formRef = ref()
/** 定义响应式变量 */
const state = reactive({
  submitLoading: false,
  form: {
    id: props.row.id || null,
    label: props.row.label || '',
    value: props.row.value || '',
    typeId: null,
    eleType: props.row.id ? props.row.eleType : props.eleTypeList.find(item => item.def === 'Y')?.value,
    eleClass: props.row.eleClass || '',
    sort: props.row.sort || 1,
    status: props.row.status || '1',
    remark: props.row.remark || '',
  },
})
/** 标题 */
const title = computed(() => {
  if (props.row.id || props.row.id === 0)
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

const typeName = computed(() => props.currentDictType?.typeName || '')

/** 定义方法 */
const methods = {
  // 提交
  async submit(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid) => {
      if (valid) {
        state.submitLoading = true
        state.form.typeId = props.currentDictType.id
        const { ok } = await saveDictDataApi(state.form)
        state.submitLoading = false
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
  label: [
    { required: true, message: '请输入数据标签', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '请输入数据值', trigger: 'blur' },
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
      <el-form-item label="数据类型" prop="typeId">
        <el-input v-model="typeName" disabled />
      </el-form-item>
      <el-form-item label="数据标签" prop="label">
        <el-input v-model="state.form.label" placeholder="数据标签" />
      </el-form-item>
      <el-form-item label="数据值" prop="value">
        <el-input v-model="state.form.value" placeholder="数据值" />
      </el-form-item>
      <el-form-item label="元素类型" prop="eleType">
        <el-select v-model="state.form.eleType" placeholder="请选择" filterable>
          <el-option
            v-for="item in eleTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="元素样式" prop="eleClass">
        <el-input v-model="state.form.eleClass" placeholder="元素样式类名" />
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
      <el-button type="primary" :loading="state.submitLoading" @click="methods.submit(formRef)">
        提交
      </el-button>
      <el-button @click="methods.resetForm(formRef)">
        重置
      </el-button>
    </template>
  </el-dialog>
</template>
