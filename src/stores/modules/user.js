import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import { ElNotification } from 'element-plus'
import { encode } from 'js-base64'
import { useRouteStore } from './route'
import router from '@/router'
import { loginApi, logoutApi } from '@/api/security'
import { t } from '@/i18n'

const PREFIX = import.meta.env.VITE_APP_STORAGE_PREFIX

export const useUserStore = defineStore('user', () => {
  const tokenInfo = ref()
  const userInfo = shallowRef()

  // 登录
  async function login(form) {
    const replacePath = router.currentRoute.value.query.replace || '/'

    form.utext = encode(form.username)
    form.ptext = encode(form.password)
    form.username = null
    form.password = null

    const res = await loginApi(form)
    if (!res.ok)
      return res
    tokenInfo.value = res.data
    await router.replace(replacePath)
    ElNotification({
      title: t('app.loginSuccess'),
      message: `${t('app.welcome')} ${res.data?.nickName || ''}`,
      type: 'success',
    })
  }
  // 登出
  async function logout(skip = false) {
    try {
      !skip && await logoutApi()
    }
    finally {
      const routeStore = useRouteStore()
      tokenInfo.value = null
      userInfo.value = null
      if (router.currentRoute.value.path !== '/login')
        await router.replace(`/login?replace=${router.currentRoute.value.path}`)
      routeStore.$reset()
    }
  }

  return { tokenInfo, userInfo, login, logout }
}, {
  persist: {
    key: `${PREFIX}USER`,
    paths: ['tokenInfo'],
    storage: localStorage,
  },
})
