<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const formRef = ref()
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
}

const state = reactive({
  loginLoading: false,
  rememberMe: false,
  form: {
    username: 'admin',
    password: '123456',
    tokenTimeout: null,
  },
})
const methods = {
  async onSubmit(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid) => {
      if (valid) {
        state.loginLoading = true
        if (state.rememberMe)
          state.form.tokenTimeout = 604800 // 7天

        try {
          await userStore.login({ ...state.form })
        }
        catch (error) {

        }
        state.loginLoading = false
      }
    })
  },
  // 键盘回车登录
  enterKey(event) {
    const code = event.keyCode
      ? event.keyCode
      : event.which
        ? event.which
        : event.charCode
    if (code === 13 && !state.loginLoading)
      methods.onSubmit(formRef.value)
  },
}
onMounted(() => {
  document.addEventListener('keyup', methods.enterKey)
})
onUnmounted(() => {
  document.removeEventListener('keyup', methods.enterKey)
})
</script>

<template>
  <el-form ref="formRef" :model="state.form" :rules="rules">
    <el-form-item prop="username">
      <el-input v-model="state.form.username" style="width:230px;" :prefix-icon="User" placeholder="用户名" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="state.form.password" style="width: 230px;" :prefix-icon="Lock" type="password" show-password placeholder="密码" />
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="state.rememberMe" label="7天免登录" />
    </el-form-item>
    <el-form-item>
      <el-button class="w-full" type="primary" :loading="state.loginLoading" @click="methods.onSubmit(formRef)">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>
