<script setup>
import Login from './Login.vue'
import AdminInit from './AdminInit.vue'
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>

<template>
  <div class="long-page">
    <p class="login-title">
      NewbieBoot 企业级快速开发平台
    </p>
    <AdminInit v-if="appStore.appConfig.enableAdminInit" class=" absolute top-0 right-0" />
    <div class="form-card">
      <img src="@/assets/images/pages/login/计划机器人.png" style="background-color: #d6e0f5;width: 60%;height: 100%;">
      <div class="card-login ">
        <p style="font-size: 20px;font-weight: 600; margin-bottom: 20px;display: flex;justify-content: center;">
          <span>登录</span>
        </p>
        <Login />
        <div class="flex">
          <el-button type="primary" link>
            手机号登录
          </el-button>
          <el-button type="primary" link>
            邮箱登录
          </el-button>
        </div>

        <el-divider>
          <template #default>
            <span style="font-size: 12px;">第三方登录</span>
          </template>
        </el-divider>
        <div class="flex justify-between items-center w-[50%]">
          <el-icon size="24" color="#24d76e" class=" cursor-pointer">
            <SvgIcon name="ic:round-wechat" />
          </el-icon>
          <el-icon size="24" color="#409eff" class=" cursor-pointer">
            <SvgIcon name="ant-design:alipay-circle-outlined" />
          </el-icon>
          <el-icon size="24" color="#00a5ff" class=" cursor-pointer">
            <SvgIcon name="ri:dingding-fill" />
          </el-icon>
        </div>
      </div>
    </div>
    <p class="login-footer">
      <span style="font-size: 14px;">Copyright © 2024 newbie 拥有所有版权</span>
    </p>
  </div>
</template>

<style scoped>
.login-title{
  font-size: 24px;
  font-weight: 600;
  margin: -100px 0 100px 0 ;

  color: #3555e0;
}
.login-footer{
  position: absolute;
  bottom: 10px;
  color: #494949;
}
.card-login {
  width: 40%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-card {
  width: 800px;
  height: 420px;
  background-color: #fff;
  box-shadow: 0 0 10px 2px #9bb2e5;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
}

.long-page {
  width: 100%;
  height: 100vh;
  background-color: #d6e0f5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
