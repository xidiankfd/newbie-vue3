<script setup>
import { onMounted, reactive, ref } from 'vue'
import { updateUserPassword } from '@/api/system/user'
import { encode } from 'js-base64';

const props = defineProps({
  row: { type: Object, required: true },
})
const value = defineModel({ type: Boolean, default: false })
const formRef = ref()
const state = reactive({
  form: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    immediatelyKick: true,
  },
})
const methods = {
  async onSubmit(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid) => {
      if (valid) {
        const data = {
          userId: props.row.id,
        }
        data.otext = encode(state.form.oldPassword)
        data.ntext = encode(state.form.newPassword)
        data.ctext = encode(state.form.confirmPassword)
        data.immediatelyKick = state.form.immediatelyKick
        
        const { ok } = await updateUserPassword(data)
        if (ok)
          value.value = false
      }
    })
  },
}
onMounted(() => {

})
const rules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== state.form.newPassword)
          callback(new Error('两次密码不一致'))
        else
          callback()
      },
      trigger: 'change',
    },
  ],
}
</script>

<template>
  <el-dialog
    v-model="value"
    :title="`昵称：${row.nickName}  用户名：${props.row.username}`"
    width="30%"
  >
    <el-form ref="formRef" :model="state.form" :rules="rules" label-width="80px">
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="state.form.newPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="state.form.confirmPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="" prop="immediatelyKick">
        <el-checkbox v-model="state.form.immediatelyKick" label="修改成功后强制下线" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button type="primary" @click="methods.onSubmit(formRef)">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
