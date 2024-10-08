<template>
    <el-drawer v-model="state.dataFormVisible"  size="30%" :title="title">

    <el-form :model="state.dataForm" ref="formRef" :rules="rules" label-width="120px">
      <el-form-item label="配置名称：" prop="configName">
        <el-input :disabled="state.isDetail" v-model="state.dataForm.configName" />
      </el-form-item>
      <el-form-item label="作者：" prop="author">
        <el-input :disabled="state.isDetail" v-model="state.dataForm.author" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input :disabled="state.isDetail" v-model="state.dataForm.email" />
      </el-form-item>
      <el-form-item label="日期格式：" prop="dateFormat">
        <el-input :disabled="state.isDetail" v-model="state.dataForm.dateFormat" />
      </el-form-item>
      <el-form-item label="父级包名：" prop="packageParent">
        <el-input :disabled="state.isDetail" v-model="state.dataForm.packageParent" />
      </el-form-item>
      <el-form-item label="模块名：" prop="moduleName">
        <el-input :disabled="state.isDetail" v-model="state.dataForm.moduleName" />
      </el-form-item>
      <el-form-item label="表名前缀：" prop="tablePrefix">
        <el-input :disabled="state.isDetail" v-model="state.dataForm.tablePrefix" />
      </el-form-item>
      <el-form-item label="接口权限控制：" prop="enableApiAuth">
        <el-switch :disabled="state.isDetail" v-model="state.dataForm.enableApiAuth" active-value="1" inactive-value="0"/>
      </el-form-item>
      <el-form-item label="接口文档：" prop="enableSpringDoc">
        <el-switch :disabled="state.isDetail" v-model="state.dataForm.enableSpringDoc" active-value="1" inactive-value="0"/>
      </el-form-item>
      <el-form-item label="ui抽屉组件：" prop="enableDrawer">
        <el-switch :disabled="state.isDetail" v-model="state.dataForm.enableDrawer" active-value="1" inactive-value="0"/>
      </el-form-item>
    </el-form>
    <template #footer v-if="!state.isDetail">
      <el-button @click="state.dataFormVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
    </template>
    </el-drawer>
</template>

<script setup>
  import { reactive, ref, computed } from 'vue'
  import { saveDeptApi } from '@/api/dev-tool/genConfig'

  defineOptions({ name: 'GenConfigDataForm' })
  const emit = defineEmits(['submitSuccess'])

  /**表单校验规则 */
  const rules = {
    configName: [
        { required: true, message: '必填项', trigger: 'blur' },
    ],
    author: [
        { required: true, message: '必填项', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '必填项', trigger: 'blur' },
    ],
    dateFormat: [
        { required: true, message: '必填项', trigger: 'blur' },
    ],
    packageParent: [
        { required: true, message: '必填项', trigger: 'blur' },
    ],
    moduleName: [
        { required: true, message: '必填项', trigger: 'blur' },
    ],
  }

  /**定义响应式数据 */
  const formRef = ref()
  const state = reactive({
    dataFormVisible: false,
    isDetail: false,
    dataForm: {
      
    },
  })


  const title = computed(() => state.isDetail ? '数据详情' : state.dataForm.id ? '编辑数据' : '新增数据')

  /**提交事件 */
  async function onSubmit(formEl) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        const data = { ...state.dataForm }
        saveDeptApi(data).then(res => {
          emit('submitSuccess')
        }).finally(()=>{
          state.dataFormVisible = false
        })
      }
    })
  }

  defineExpose({
    open(row, isDetail) {
      formRef.value && formRef.value.resetFields()
      state.isDetail = !!isDetail
      state.dataForm = row || {}
      state.dataFormVisible = true
    }
  })

</script>

<style scoped>

</style>