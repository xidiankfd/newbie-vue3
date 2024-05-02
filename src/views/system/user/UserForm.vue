<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { saveUserApi } from '@/api/system/user'
import { getDeptTreeApi } from '@/api/system/dept'

const props = defineProps({
  row: {
    type: Object, default: () => { },
  },
  modelValue: { type: Boolean },
  userGenderList: { type: Array, required: true },
  userStatusList: { type: Array, required: true },
})
const emit = defineEmits(['onSaveSuccess', 'update:modelValue'])
const showDialog = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})
const treeProps = {
  label: 'deptName',
  value: 'id',
}
const formRef = ref()

/** 定义响应式数据 */
const state = reactive({
  isUpdate: false, // 是否为修改
  saveLoading: false, // 保存按钮loading
  // 表单数据
  formData: {
    id: (props.row.id || props.row.id === 0) ? props.row.id : null,
    deptId: (props.row.deptId || props.row.deptId === 0) ? props.row.deptId : null,
    username: props.row.username || '',
    password: '',
    nickName: props.row.nickName || '',
    phone: props.row.phone || '',
    homePath: props.row.homePath || '',
    email: props.row.email || '',
    gender: props.row.gender || props.userGenderList.find(item => item.def === 'Y')?.value,
    status: props.row.status || '1',
    sort: props.row.sort || props.row.sort === 0 ? props.row.sort : 1,
    remark: props.row.remark || '',
  },
  deptTree: [],
  roleList: [],
  statusRadio: [
    { label: '正常', value: '1' },
    { label: '禁用', value: '0' },
  ],
  genderSelect: [
    { label: '未知', value: '2' },
    { label: '男', value: '1' },
    { label: '女', value: '0' },

  ],
})
/** 表单验证规则 */
const rules = {
  username: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' },
  ],
  nickName: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
  ],
}
/** 定义方法 */
const methods = {
  /** 初始化部门树 */
  async initDeptTree() {
    const { ok, data } = await getDeptTreeApi()
    state.deptTree = ok ? data : []
  },
  /** 保存数据 */
  async save(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        state.saveLoading = true
        const { ok } = await saveUserApi(state.formData)
        state.saveLoading = false
        ok && emit('onSaveSuccess')
      }
      else {
        console.error('error submit!', fields)
      }
    })
  },
  /** 重置表单 */
  resetForm(formEl) {
    if (!formEl)
      return
    formEl.resetFields()
  },
}
const dialogTitle = computed(() => state.isUpdate ? '修改用户' : '新增用户')
onMounted(() => {
  state.isUpdate = props.row.id || props.row.id === 0
  methods.initDeptTree()
})
</script>

<template>
  <el-dialog v-model="showDialog" width="700px" :title="dialogTitle" append-to-body>
    <el-form ref="formRef" :model="state.formData" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username" class="w-full">
            <el-input v-model="state.formData.username" :disabled="state.isUpdate" placeholder="请输入用户名" maxlength="15" />
          </el-form-item>
        </el-col>
        <el-col v-if="!state.isUpdate" :span="12">
          <el-form-item label="登录密码" prop="password" class="w-full">
            <el-input
              v-model="state.formData.password"
              show-password type="password" placeholder="请输入登录密码" maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName" class="w-full">
            <el-input v-model="state.formData.nickName" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" class="w-full">
            <el-tree-select
              v-model="state.formData.deptId" placeholder="所属部门" class="w-full" clearable
              :data="state.deptTree" :props="treeProps" node-key="id" check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone" class="w-full">
            <el-input v-model="state.formData.phone" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="首页地址" prop="homePath" class="w-full">
            <el-input v-model="state.formData.homePath" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="deptId" class="w-full">
            <el-input v-model="state.formData.email" placeholder="请输入邮箱" maxlength="35" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender" class="w-full">
            <el-select v-model="state.formData.gender" placeholder="请选择性别" class="w-full">
              <el-option v-for="item in userGenderList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status" class="w-full">
            <el-switch
              v-model="state.formData.status" active-value="1" inactive-value="0" inline-prompt
              active-text="正常" inactive-text="锁定"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort" class="w-full">
            <el-input-number
              v-model="state.formData.sort"
              :value-on-clear="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户描述" prop="remark">
            <el-input
              v-model="state.formData.remark" type="textarea" placeholder="请输入用户描述" maxlength="120"
              show-word-limit :rows="4"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="methods.resetForm(formRef)">
        重置
      </el-button>
      <el-button :loading="state.saveLoading" type="primary" @click="methods.save(formRef)">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>
