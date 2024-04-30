<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import SvgIcon from '@/components/svg-icon/index.vue'
import { imageCaptchaApi } from '@/api/security'

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
  checkCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
}

const state = reactive({
  captchaImage: '', // 验证码图片
  captchaLoading: false,
  loginLoading: false,
  rememberMe: false,
  form: {
    username: 'admin',
    password: '123456',
    checkCode: '',
    checkCodeKey: '',
    tokenTimeout: null,
  },
})
const methods = {
  async getCaptchaImage() {
    state.captchaLoading = true
    const params = {
      key: state.form.checkCodeKey,
    }
    try {
      const res = await imageCaptchaApi(params)
      state.captchaImage = res.data.imageBase64
      state.form.checkCodeKey = res.data.checkCodeKey
    }
    catch (error) {

    }
    finally {
      state.captchaLoading = false
    }
  },
  async onSubmit(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid) => {
      if (valid) {
        state.loginLoading = true
        if (state.rememberMe)
          state.form.tokenTimeout = 604800 // 7天
        try {
          const res = await userStore.login({ ...state.form })
          if (res && res.msg === '验证码已失效')
            methods.getCaptchaImage()
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
  methods.getCaptchaImage()
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
    <el-form-item prop="checkCode">
      <div class="flex items-center">
        <el-input v-model="state.form.checkCode" style="width: 130px;" placeholder="验证码">
          <template #prefix>
            <el-icon>
              <SvgIcon name="MaterialSymbolsShieldLockedOutlineRounded" />
            </el-icon>
          </template>
        </el-input>
        <div v-loading="state.captchaLoading">
          <img
            :src="state.captchaImage" class="w-[100px] h-[30px] cursor-pointer"
            @click="methods.getCaptchaImage"
          >
        </div>
      </div>
    </el-form-item>
    <el-form-item>
      <el-checkbox id="rememberMe" v-model="state.rememberMe" label="7天免登录" />
    </el-form-item>
    <el-form-item>
      <el-button class="w-full" type="primary" :loading="state.loginLoading" @click="methods.onSubmit(formRef)">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>
