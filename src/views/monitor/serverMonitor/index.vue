<script setup>
import { computed, onMounted, reactive } from 'vue'
import { getServerInfoApi } from '@/api/monitor/server'

defineOptions({
  name: 'SysServerMonitor',
})

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
  monInfo: {
    jvmInfo: {},
    osInfo: {},
    cpuInfo: {},
    systemMemory: {},
    swapMemory: {},
    disksInfo: {},
    networkInfoList: [],
  },
})
// 磁盘使用率
const disksUsage = computed(() => {
  if (!state.monInfo.disksInfo.disksList)
    return 0
  let total = 0
  state.monInfo.disksInfo.disksList.forEach((item) => {
    total += Number(item.usage.substring(0, item.usage.length - 1))
  })
  if (total === 0)
    return 0
  return total / state.monInfo.disksInfo.disksList.length
})
async function queryData() {
  const res = await getServerInfoApi()
  state.monInfo = res.data
}
function parseUsage(val) {
  if (!val)
    return 0
  return Number(val.substring(0, val.length - 1))
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
              type="dashboard" :percentage="parseUsage(state.monInfo.systemMemory.usage)" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  系统内存
                </p>
              </template>
            </el-progress>
          </el-col>
          <el-col :span="6" :offset="0" style="display: flex;justify-content: center;">
            <el-progress
              type="dashboard" :percentage="parseUsage(state.monInfo.jvmInfo.usage)" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  JVM内存
                </p>
              </template>
            </el-progress>
          </el-col>
          <el-col :span="6" :offset="0" style="display: flex;justify-content: center;">
            <el-progress
              type="dashboard" :percentage="parseUsage(state.monInfo.cpuInfo.cpuUsage)" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  CPU
                </p>
              </template>
            </el-progress>
          </el-col>
          <el-col :span="6" :offset="0" style="display: flex;justify-content: center;">
            <el-progress
              type="dashboard" :percentage="disksUsage" :color="percentageConfig.colors"
              :stroke-width="percentageConfig.strokeWidth" :width="percentageConfig.width"
            >
              <template #default="{ percentage }">
                <p>
                  {{ percentage }}%
                </p>
                <p class="mt-2">
                  磁盘
                </p>
              </template>
            </el-progress>
          </el-col>
        </el-row>
      </el-card>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-card shadow="never" class="mt-2" header="系统内存">
            <el-descriptions :column="3" direction="vertical">
              <el-descriptions-item label="内存总量">
                {{ state.monInfo.systemMemory.total }}
              </el-descriptions-item>
              <el-descriptions-item label="内存使用量">
                {{ state.monInfo.systemMemory.used }}
              </el-descriptions-item>
              <el-descriptions-item label="内存使用率">
                {{ state.monInfo.systemMemory.usage }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-card shadow="never" class="mt-2" header="JVM内存">
            <el-descriptions :column="4" direction="vertical">
              <el-descriptions-item label="内存总量">
                {{ state.monInfo.jvmInfo.total }}
              </el-descriptions-item>
              <el-descriptions-item label="内存使用量">
                {{ state.monInfo.jvmInfo.used }}
              </el-descriptions-item>
              <el-descriptions-item label="内存使用率">
                {{ state.monInfo.jvmInfo.usage }}
              </el-descriptions-item>
              <el-descriptions-item label="最大可用内存总数">
                {{ state.monInfo.jvmInfo.max }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="24" :offset="0">
          <el-card shadow="never" class="mt-2" header="系统信息">
            <el-descriptions :column="4">
              <el-descriptions-item label="系统：">
                {{ state.monInfo.osInfo.os }}
              </el-descriptions-item>
              <el-descriptions-item label="系统架构：">
                {{ state.monInfo.osInfo.osArch }}
              </el-descriptions-item>
              <el-descriptions-item label="系统启动时间：">
                {{ state.monInfo.osInfo.bootTime }}
              </el-descriptions-item>
              <el-descriptions-item label="系统正常运行时长：">
                {{ state.monInfo.osInfo.runTime }}
              </el-descriptions-item>

              <el-descriptions-item label="主机名称：">
                {{ state.monInfo.osInfo.hostName }}
              </el-descriptions-item>
              <el-descriptions-item label="主机host：">
                {{ state.monInfo.osInfo.host }}
              </el-descriptions-item>
              <el-descriptions-item label="cpu核心数：">
                {{ state.monInfo.osInfo.cpuCount }}
              </el-descriptions-item>
              <el-descriptions-item label="工作目录：">
                {{ state.monInfo.osInfo.userDir }}
              </el-descriptions-item>

              <el-descriptions-item label="Java版本：">
                {{ state.monInfo.osInfo.javaVersion }}
              </el-descriptions-item>
              <el-descriptions-item label="JDK路径：">
                {{ state.monInfo.jvmInfo.jdkHome }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="24" :offset="0">
          <el-card shadow="never" class="mt-2">
            <template #header>
              <div class="flex justify-between">
                <span> 磁盘信息 </span>
                <span>
                  <el-text>读取：{{ state.monInfo.disksInfo.diskReadRate }}</el-text>
                  <el-text> 写入：{{ state.monInfo.disksInfo.diskWriteRate }}</el-text>
                </span>
              </div>
            </template>
            <el-table :data="state.monInfo.disksInfo.disksList" border stripe>
              <el-table-column prop="dirName" label="挂载点" width="90px" header-align="center" />
              <el-table-column prop="sysTypeName" label="文件系统名称" header-align="center" />
              <el-table-column prop="typeName" label="文件系统类型" header-align="center" align="center" width="120px" />
              <el-table-column prop="total" label="磁盘总量" header-align="center" align="right" />
              <el-table-column prop="used" label="磁盘使用量" header-align="center" align="right" />
              <el-table-column prop="free" label="磁盘剩余量" header-align="center" align="right" />
              <el-table-column prop="usage" label="磁盘使用率" header-align="center" align="right" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="24" :offset="0">
          <el-card shadow="never" class="mt-2" header="网卡信息">
            <el-table :data="state.monInfo.networkInfoList" border stripe>
              <el-table-column prop="ipv4Address" label="ipv4地址" header-align="center" />
              <el-table-column prop="macAddress" label="mac地址" header-align="center" />
              <el-table-column prop="networkName" label="网卡名称" header-align="center" />
              <el-table-column prop="send" label="上传速度↑" header-align="center" align="right" />
              <el-table-column prop="accept" label="下载速度↓" header-align="center" align="right" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
