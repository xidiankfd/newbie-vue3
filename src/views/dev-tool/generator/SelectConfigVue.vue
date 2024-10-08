<template>
    <el-dialog title="选择配置" v-model="state.showSelectConfig" width="50%">
        <el-radio-group v-model="state.configId">
            <el-radio v-for="item in state.tableData" :key="item.id" :value="item.id">{{ item.configName }}</el-radio>
        </el-radio-group>
        <template #footer>
            <span>
                <el-button @click="state.showSelectConfig = false">取消</el-button>
                <el-button type="primary" @click="generate" :loading="state.submitLoading">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { generateApi } from '@/api/dev-tool/generator'
import {  listApi } from '@/api/dev-tool/genConfig'
import {downloadBlobFile} from '@/api/file'
import { ElMessage } from 'element-plus';

const state = reactive({
    submitLoading:false,
    configId: '',
    showSelectConfig: false,
    tableNames: [],
    queryLoading: false,
    tableData: [], // 表格数据
})
function queryData() {
    listApi({}).then(res => {
        state.tableData = res.data
    })
}

/**代码生成 */
function generate() {
    if(!state.configId){
        ElMessage.error('请选择配置')
        return
    }
    state.submitLoading = true
    const data = {
        tableNames: state.tableNames,
        configId: state.configId
    }
    generateApi(data).then(res => {
        downloadBlobFile(res.data, 'src.zip')
        state.showSelectConfig = false
    }).finally(()=>{
        state.submitLoading = false
    })
}
onMounted(() => {
    queryData()
})
defineExpose({
    open(tableNames) {
        if (!tableNames?.length) {
            return
        }
        state.tableNames = tableNames
        state.showSelectConfig = true
    }
})
</script>

<style scoped></style>