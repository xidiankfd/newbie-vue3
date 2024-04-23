<script setup>
import { onMounted, reactive, ref } from 'vue'
import { initAdmin } from '@/api/security'

const formRef = ref()

const state = reactive({
  loading: false,
  showDialog: false,
  form: {
    newPassword: '',
    confirmPassword: '',
    username: 'admin',
  },
})
const rules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== state.form.newPassword)
          callback(new Error('两次密码不一致'))
        else
          callback()
      },
      trigger: 'change',
    },
  ],
}
const methods = {
  async doSubmit(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid) => {
      if (valid) {
        state.loading = true
        const res = await initAdmin({ ...state.form })
        if (res.ok)
          state.showDialog = false
        state.loading = false
      }
    })
  },
}
onMounted(() => {
  console.warn('admin初始化为开启状态，请在admin初始化完毕后在配置文件appConfig.js中关闭此功能 enableAdminInit')
})
</script>

<template>
  <div>
    <el-button type="primary" link @click="state.showDialog = true ">
      Admin初始化
    </el-button>
    <el-dialog
      v-model="state.showDialog"
      title="Admin初始化"
      width="30%"
    >
      <el-form ref="formRef" :model="state.form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="state.form.username" disabled />
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input v-model="state.form.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="state.form.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :loading="state.loading" type="primary" @click="methods.doSubmit(formRef)">
          初始化
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
