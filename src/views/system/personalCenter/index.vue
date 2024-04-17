<script setup>
import { onMounted, reactive } from 'vue'
import { useAppStore } from '@/stores/modules/app'

defineOptions({
  name: 'PersonalCenter',
})

const appStore = useAppStore()

const state = reactive({
  form: {

  },
})
const methods = {

}
onMounted(() => {

})
</script>

<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="8" :offset="0">
        <el-card :shadow="appStore.appConfig.elChardShadow">
          <template #header>
            <div>
              <span>基本信息</span>
            </div>
          </template>
          ------
        </el-card>
      </el-col>
      <el-col :span="16" :offset="0">
        <el-card :shadow="appStore.appConfig.elChardShadow">
          <template #header>
            <div>
              <span>登录日志</span>
            </div>
          </template>
          ------
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>
