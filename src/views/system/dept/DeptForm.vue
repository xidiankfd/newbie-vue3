<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getDeptTreeApi, saveDeptApi } from '@/api/system/dept'

const props = defineProps({
  dialogVisible: { type: Boolean, default: false },
  currentRow: { type: Object, default: () => { return {} } },
})
const emit = defineEmits(['saveSuccess'])

const deptTreeProp = {
  label: 'deptName',
  value: 'id',
}

const formRef = ref()
const rules = {
  parentId: [
    { required: true, message: '请选择父级部门', trigger: 'change' },
  ],
  deptName: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
  ],
}

/** 定义响应式变量 */
const state = reactive({
  submitLoading: false,
  deptTree: [],
  form: {
    id: props.currentRow.id || null,
    parentId: props.currentRow.parentId || 0,
    deptName: props.currentRow.deptName || '',
    leader: props.currentRow.leader || '',
    phone: props.currentRow.phone || '',
    email: props.currentRow.email || '',
    status: props.currentRow.status || '1',
    remark: props.currentRow.remark || '',
    sort: props.currentRow.sort || 1,
  },
})
/** 定义方法 */
const methods = {
  isUpdate() {
    return !!(props.currentRow.id === 0 || props.currentRow.id)
  },
  // 初始化部门树
  async initDeptTree() {
    const { data } = await getDeptTreeApi()

    state.deptTree = [
      {
        deptName: '顶级',
        id: 0,
      },
      ...data,
    ]
  },

  // 重置
  resetForm(formEl) {
    if (!formEl)
      return
    formEl.resetFields()
  },
  // 提交点击事件
  async onSubmitClick(formEl) {
    if (!formEl)
      return

    await formEl.validate(async (valid) => {
      if (valid) {
        state.submitLoading = true
        const { ok } = await saveDeptApi(state.form)
        state.submitLoading = false
        ok && emit('saveSuccess')
      }
    })
  },
}
/** 标题 */
const title = computed(() => methods.isUpdate() ? '修改数据' : '新增数据')
onMounted(() => {
  methods.initDeptTree()
})
</script>

<template>
  <el-dialog
    :model-value="props.dialogVisible"
    :title="title"
    width="50%"
  >
    <el-form ref="formRef" :model="state.form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="父级部门" prop="parentId">
            <el-tree-select
              v-model="state.form.parentId"
              :disabled="methods.isUpdate()"
              class="w-full" filterable :data="state.deptTree" :props="deptTreeProp"
              node-key="id" check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="state.form.deptName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="state.form.leader" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="state.form.phone" placeholder="请输入" :maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="state.form.email" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="state.form.sort" style="width: 100%;" :value-on-clear="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="状态" prop="status">
            <el-switch v-model="state.form.status" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24" :offset="0">
          <el-form-item label="描述" prop="remark">
            <el-input v-model="state.form.remark" placeholder="请输入" type="textarea" :maxlength="120" show-word-limit :rows="4" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="methods.resetForm(formRef)">重置</el-button>
        <el-button type="primary" :loading="state.submitLoading" @click="methods.onSubmitClick(formRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
