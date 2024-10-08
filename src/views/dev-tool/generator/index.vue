<template>
    <el-container>
        <el-main>
            <el-card shadow="never">
                <el-form :model="state.queryForm" ref="queryFormRef" inline>
                    <el-form-item label="表名：" prop="name">
                        <el-input v-model="state.queryForm.name" />
                    </el-form-item>
                    <el-form-item label="注释：" prop="comment">
                        <el-input v-model="state.queryForm.comment" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryData" :loading="state.queryLoading"
                            :icon="Search">查询</el-button>
                        <el-button type="warning" @click="refreshQuery(queryFormRef)" :loading="state.queryLoading"
                            :icon="Refresh">重置</el-button>
                            <el-button type="success" @click="handleGenerateClick" :icon="Download">生成</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card shadow="never" style="margin-top: 20px;">
                <el-table :data="state.tableData" border stripe v-loading="state.queryLoading" ref="tableRef">
                    <el-table-column type="selection" width="55" />
                    <el-table-column type="index" width="50" />
                    <el-table-column prop="name" label="表名" width="auto" header-align="center" align="left" />
                    <el-table-column prop="comment" label="注释" width="auto" header-align="center" align="left" />
                </el-table>
                <el-pagination style="margin-top: 20px;" v-model:current-page="state.pageInfo.current"
                    v-model:page-size="state.pageInfo.size" :page-sizes="[10, 20, 30, 50]" background
                    :default-page-size="state.pageInfo.size"
                    layout="->,total, sizes, prev, pager, next, jumper" :total="state.pageInfo.total" @size-change="queryData"
                    @current-change="queryData" />
            </el-card>
        </el-main>
        <SelectConfigVue ref="selectConfigRef"/>
    </el-container>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Search, Refresh,Download } from '@element-plus/icons-vue'
import { listApi,generateApi } from '@/api/dev-tool/generator'
import { ElMessage, ElMessageBox } from 'element-plus'
import {downloadBlobFile} from '@/api/file'
import SelectConfigVue from './SelectConfigVue.vue'

defineOptions({ name: 'TestVue' })

/**定义响应式数据 */
const tableRef = ref()
const queryFormRef = ref()
const selectConfigRef = ref()
const state = reactive({
    queryLoading: false,
    tableData: [], // 表格数据
    // 分页信息
    pageInfo: {
        current: 1,
        size: 10,
        total: 0,
    },
    queryForm: {

    },
})
 /**生成按钮点击事件 */
function handleGenerateClick(){
    if(!tableRef.value){
        ElMessage.warning('表格未加载，请重试！')
        return
    }
    const selectedList = tableRef.value.getSelectionRows()
    if(!selectedList?.length){
        ElMessage.error('请选择至少一个目标')
        return
    }
    const tableNames = selectedList.map(item=>item.name)
    selectConfigRef.value && selectConfigRef.value.open(tableNames)
}
/**查询数据 */
function queryData() {
    state.queryLoading = true
    const params = {
        ...state.queryForm,
        current:state.pageInfo.current,
        size:state.pageInfo.size
    }
    listApi(params).then(res => {
        state.tableData = res.data.records
        state.pageInfo.total = res.data.total
    })
    state.queryLoading = false
}
/**重置查询条件 */
function refreshQuery(formEl) {
    if (!formEl) return
    formEl.resetFields()
    queryData()
}
/**新增按钮点击事件 */
function handleAddClick() {
    dataFormRef.value && dataFormRef.value.open()
}
/**详情按钮点击事件 */
function handleDetailClick(currRow){
    dataFormRef.value && dataFormRef.value.open(currRow,true)
}
/**编辑按钮点击事件 */
function handleEditClick(currRow) {
    dataFormRef.value && dataFormRef.value.open(currRow)
}
/**删除按钮点击事件 */
function handleDeleteClick(currRow) {
    ElMessageBox.confirm(
        '确定要删除此条数据吗?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            deleteByPkValApi(currRow.id).then(res => {
                queryData()
            })
        })
}
onMounted(() => {
    queryData()
})
</script>

<style scoped></style>