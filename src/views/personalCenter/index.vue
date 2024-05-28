<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/modules/app'
import usePagingParams from '@/hooks/usePagingParams'
import { pagingByCurrUserApi } from '@/api/system/log_login'
import useAuth from '@/hooks/useAuth'
import { useUserStore } from '@/stores/modules/user'
import { updatePassword } from '@/api/security'
import { updateByCurrApi } from '@/api/system/user'
import { getFileDownloadUrl, uploadPath } from '@/api/file'

defineOptions({
  name: 'PersonalCenter',
})

const userStore = useUserStore()
const { userInfo, tokenInfo } = useAuth()
const { current, size } = usePagingParams()
const appStore = useAppStore()
const editFormRef = ref()
const pwdFormRef = ref()

const state = reactive({
  queryLoading: false,
  tableData: [],
  total: 0,
  showEditDialog: false,
  editForm: {
    nickName: userInfo.nickName,
    phone: userInfo.phone,
    email: userInfo.email,
    gender: userInfo.gender,
    avatar: userInfo.avatar,
    remark: userInfo.remark,
  },
  avatarFile: null,
  showUpdatePasswordDialog: false,
  updatePasswordForm: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },

})
const rules = {
  nickName: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
  ],
}
const pwdRules = {
  oldPassword: [
    { required: true, message: '旧密码不能为空', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== state.updatePasswordForm.newPassword)
          callback(new Error('两次密码不一致'))
        else
          callback()
      },
      trigger: 'change',
    },
  ],
}
const methods = {
  // 查询数据
  async queryData() {
    state.queryLoading = true
    const { ok, data } = await pagingByCurrUserApi({ ...state.queryForm, current: current.value, size: size.value })
    state.tableData = ok ? data.records : []
    state.total = ok ? data.total : 0
    state.queryLoading = false
  },
  doLogout() {
    ElMessageBox.confirm(
      '是否确认退出登录?',
      '警告',
      {
        confirmButtonText: '是的',
        cancelButtonText: '点错了',
        type: 'warning',
      },
    )
      .then(() => {
        userStore.logout()
      })
      .catch(() => {

      })
  },
  async  updatePwd(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const res = await updatePassword({ ...state.updatePasswordForm })
        if (res?.ok) {
          ElMessageBox.confirm(
            '修改密码成功',
            '提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '以后再说',
              type: 'success',
            },
          )
            .then(() => {
              userStore.logout()
            })
            .catch(() => {
              state.showUpdatePasswordDialog = false
            })
        }
      }
    })
  },
  async updateUserInfo(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const res = await updateByCurrApi({ ...state.editForm })
        if (res?.ok) {
          ElMessageBox.confirm(
            '信息修改成功',
            '提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '以后再说',
              type: 'success',
            },
          )
            .then(() => {
              userStore.logout()
            })
            .catch(() => {
              state.showEditDialog = false
            })
        }
      }
    })
  },
  onUploadSuccess(res) {
    if (res?.ok)
      state.editForm.avatar = res.data[0].filePath
  },
}
onMounted(() => {
  methods.queryData()
})
</script>

<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <!-- 基本信息 -->
        <el-col :span="8" :offset="0">
          <el-card :shadow="appStore.appConfig.elChardShadow">
            <template #header>
              <div>
                <span>基本信息</span>
              </div>
            </template>

            <el-descriptions :column="1" border>
              <template #title>
                <el-avatar :size="50" :src="userInfo?.avatar ? getFileDownloadUrl(userInfo.avatar) : '/default-avatar.png'" />
              </template>
              <template #extra>
                <el-button type="primary" link @click="state.showEditDialog = true">
                  编辑
                </el-button>
              </template>
              <el-descriptions-item label="用户名">
                {{ userInfo.username }}
              </el-descriptions-item>
              <el-descriptions-item label="昵称">
                {{ userInfo.nickName }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ userInfo.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ userInfo.email }}
              </el-descriptions-item>
              <el-descriptions-item label="性别">
                <el-tag>
                  {{ userInfo.gender === '1' ? '男' : userInfo.gender === '0' ? '女' : '未知' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="描述">
                {{ userInfo.remark }}
              </el-descriptions-item>
              <el-descriptions-item>
                <el-button link type="warning" @click="state.showUpdatePasswordDialog = true">
                  修改密码
                </el-button>
                <el-button link type="danger" @click="methods.doLogout">
                  退出登录
                </el-button>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <!-- 基本信息结束 -->
        <!-- 登录日志 -->
        <el-col :span="16" :offset="0">
          <el-card :shadow="appStore.appConfig.elChardShadow">
            <template #header>
              <div>
                <span>登录日志</span>
              </div>
            </template>
            <el-table
              v-loading="state.queryLoading" :data="state.tableData" border stripe
              height="calc(100vh - 290px)"
            >
              <el-table-column label="序号" fixed="left" type="index" align="right" header-align="center" width="65px">
                <template #default="{ $index }">
                  {{ (current - 1) * size + $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="username" label="用户名" min-width="120px" fixed="left" align="left"
                header-align="center"
              />
              <el-table-column
                prop="loginIp" label="IP" align="center" header-align="center"
                width="130px"
              />
              <el-table-column
                prop="loginType" label="登入/登出" show-overflow-tooltip align="center" header-align="center"
                min-width="100px"
              >
                <template #default="{ row }">
                  <el-tag :type="row.loginType === '1' ? 'success' : 'warning'">
                    {{ row.loginType === '1' ? '登入' : '登出' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" align="center" header-align="center" />

              <el-table-column label="状态" width="90" align="center" header-align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === '1' ? 'primary' : 'danger'">
                    {{ row.status === '1' ? '正常' : '失败' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="costTime" label="请求耗时" align="left" header-align="center" min-width="100px"
              />
              <el-table-column
                prop="loginMethod" label="登录方式" align="left" header-align="center" width="100px"
              />

              <el-table-column
                prop="failReason" label="失败原因" show-overflow-tooltip align="left" header-align="center"
                min-width="200px"
              />
              <el-table-column
                prop="browser" label="浏览器信息" width="180" align="left" header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="os" label="操作系统" align="left" header-align="center" min-width="220px"
                show-overflow-tooltip
              />
            </el-table>
            <el-pagination
              v-model:current-page="current" v-model:page-size="size" class="mt-5" :default-page-size="size"
              :page-sizes="[10, 20, 30, 40, 50, 100]" background layout="->,total,prev, pager, next, jumper,sizes"
              :total="state.total" @current-change="methods.queryData" @size-change="methods.queryData"
            />
          </el-card>
        </el-col>
        <!-- 登录日志结束 -->
      </el-row>
      <!-- 基本信息编辑 -->
      <el-dialog
        v-model="state.showEditDialog"
        title="编辑"
        width="50%"
      >
        <el-form ref="editFormRef" :model="state.editForm" :rules="rules" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="state.editForm.nickName" placeholder="请输入昵称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="头像">
                <el-avatar :size="38" :src="state.editForm.avatar ? getFileDownloadUrl(state.editForm.avatar) : '/default-avatar.png' " />
                <el-upload
                  :action="uploadPath"
                  :show-file-list="false"
                  :headers="{ satoken: tokenInfo.tokenValue }"
                  :on-success="methods.onUploadSuccess"
                >
                  <el-button link type="primary" class="ml-2">
                    修改头像
                  </el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="手机号">
                <el-input v-model="state.editForm.phone" placeholder="请输入手机号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="邮箱">
                <el-input v-model="state.editForm.email" placeholder="请输入邮箱" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="性别">
                <el-select v-model="state.editForm.gender" placeholder="请选择性别" clearable>
                  <el-option label="男" value="1" />
                  <el-option label="女" value="0" />
                  <el-option label="未知" value="2" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" :offset="0">
              <el-form-item label="描述">
                <el-input v-model="state.editForm.remark" type="textarea" placeholder="请选择描述" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <template #footer>
          <span>
            <el-button @click=" state.showEditDialog = false">取消</el-button>
            <el-button type="primary" @click="methods.updateUserInfo(editFormRef)">提交</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 基本信息编辑结束 -->
      <!-- 修改密码 -->
      <el-dialog
        v-model="state.showUpdatePasswordDialog"
        title="修改密码"
        width="30%"
      >
        <el-form ref="pwdFormRef" :model="state.updatePasswordForm" :rules="pwdRules" label-width="80px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="state.updatePasswordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="state.updatePasswordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="state.updatePasswordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
          </el-form-item>
        </el-form>

        <template #footer>
          <span>
            <el-button @click="state.showUpdatePasswordDialog = false">取消</el-button>
            <el-button type="primary" @click="methods.updatePwd(pwdFormRef)">提交</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 修改密码结束 -->
    </el-main>
  </el-container>
</template>
