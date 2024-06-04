<script setup>
import { onMounted, reactive } from 'vue'
import { getServerInfoApi } from '@/api/monitor/server'

const percentageConfig = {

  colors: [
    { color: '#5cb87a', percentage: 51 },
    { color: '#feca39', percentage: 71 },
    { color: '#fe275c', percentage: 100 },
  ],
  strokeWidth: 10,
  width: 150,

}
const state = reactive({
  monInfo: {},
})
async function queryData() {
  const res = await getServerInfoApi()
  state.monInfo = res.data
}
onMounted(() => {
  queryData()
})
</script>

<template>
  <el-container>
    <el-main>
      <el-card shadow="never">
        <el-row :gutter="20">
          <el-col :span="6" :offset="0" style="display: flex;justify-content: center;">
            <el-progress
              type="dashboard" :percentage="state.monInfo.memoryRatio" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  {{ state.monInfo.memoryRatio === undefined ? '加载中...' : '内存已用' }}
                </p>
              </template>
            </el-progress>
          </el-col>
          <el-col :span="6" :offset="0" style="display: flex;justify-content: center;">
            <el-progress
              type="dashboard" :percentage="state.monInfo.jvmMemoryRatio" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  {{ state.monInfo.jvmMemoryRatio === undefined ? '加载中...' : 'JVM内存已用' }}
                </p>
              </template>
            </el-progress>
          </el-col>
          <el-col :span="6" :offset="0" style="display: flex;justify-content: center;">
            <el-progress
              type="dashboard" :percentage="state.monInfo.cpuRatio" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  {{ state.monInfo.cpuRatio === undefined ? '加载中...' : 'CPU已用' }}
                </p>
              </template>
            </el-progress>
          </el-col>
          <el-col :span="6" :offset="0" style="display: flex;justify-content: center;">
            <el-progress
              type="dashboard" :percentage="state.monInfo.diskRatio" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  {{ state.monInfo.diskRatio === undefined ? '加载中...' : '磁盘已用' }}
                </p>
              </template>
            </el-progress>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" class="mt-2" header="服务器信息">
        <el-descriptions :column="3">
          <el-descriptions-item label="服务器IP：">
            {{ state.monInfo.hostAddr }}
          </el-descriptions-item>
          <el-descriptions-item label="操作系统：">
            {{ state.monInfo.osName }}
          </el-descriptions-item>
          <el-descriptions-item label="系统架构：">
            {{ state.monInfo.osArch }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card shadow="never" header="JAVA" class="mt-2">
        <el-descriptions :column="2">
          <el-descriptions-item label="java版本：">
            {{ state.monInfo.javaVersion }}
          </el-descriptions-item>
          <el-descriptions-item label="java供应商：">
            {{ state.monInfo.javaVendor }}
          </el-descriptions-item>
          <el-descriptions-item label="jvm名称：">
            {{ state.monInfo.jvmName }}
          </el-descriptions-item>
          <el-descriptions-item label="jvm版本：">
            {{ state.monInfo.jvmVersion }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-main>
  </el-container>
</template>
