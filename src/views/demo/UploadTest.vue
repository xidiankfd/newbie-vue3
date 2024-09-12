<script  setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useAuth from '@/hooks/useAuth'
import { download, downloadBlobFile, getFileDownloadUrl, remove, upload } from '@/api/file'

const { tokenInfo } = useAuth()
const filePath = 'public/2024/09/12/wallhaven-7pmkj32730.png'
const fileList = ref([])

async function handleRemove(file, uploadFiles) {
  await remove(file.response.data[0].filePath)
}

function handlePreview(uploadFile) {
  console.log(uploadFile)
}

function handleExceed(files, uploadFiles) {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`,
  )
}

function beforeRemove(uploadFile, uploadFiles) {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`,
  ).then(
    () => true,
    () => false,
  )
}
const previewBlob = ref()
async function download1() {
  const res = await download(filePath)
  downloadBlobFile(res.data, '自定义文件名.jpg')
}
onMounted(async () => {

})
async function preview1() {
  const res = await download(filePath)
  const blob = new Blob([res.data])
  const URL = window.URL.createObjectURL(blob)
  previewBlob.value = URL
}
async function handleChange(e) {
  await upload(e.target.files).then((res) => {
    console.log(res)
  })
}
</script>

<template>
  <div>
    <el-card shadow="never" header="上传">
      <p>
        <span>1、element-plus组件上传</span>

        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="/file/upload"
          :headers="{ satoken: tokenInfo.tokenValue }"
          multiple
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">
            el-upload上传
          </el-button>
        </el-upload>
      </p>
      <p>
        <span>2、原生input上传</span>

        <input type="file" multiple @change="handleChange">
      </p>
    </el-card>

    <el-card shadow="never" header="预览">
      <p>
        <a :href="getFileDownloadUrl(filePath)" style="color: #0000ff">1、点击预览,self</a>
      </p>
      <p>
        <a :href="getFileDownloadUrl(filePath)" target="_blank" title="预览" style="color: #0000ff">2、点击预览,blank</a>
      </p>
      <p>
        <span>3、blob预览</span>
        <el-button type="primary" link @click="preview1">
          点击预览
        </el-button>
        <img :src="previewBlob" style="width: 100px;">
      </p>
      <p>
        <span>4、http代理预览</span>
        <img :src="`http://localhost:9999${getFileDownloadUrl(filePath)}`" style="width: 100px;">
      </p>
      <p>
        <span>5、http直接预览（minio不能用）</span>
        <img :src="`http://localhost:8080/${filePath}`" style="width: 100px;">
      </p>
    </el-card>

    <el-card shadow="never" header="下载">
      <el-button type="primary" @click="download1">
        1、下载
      </el-button>

      <a :href="getFileDownloadUrl(filePath)" download="自定义文件名.jpg" style="color: #0000ff;" class="ml-5">2、下载</a>
    </el-card>
  </div>
</template>
