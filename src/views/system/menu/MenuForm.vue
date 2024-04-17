<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { getMenuTreeApi, saveMenuApi } from '@/api/system/menu'
import { transitionNames } from '@/appConfig'
import IconSelect from '@/components/icon-select/index.vue'

const props = defineProps({
  row: { type: Object, default: () => { } },
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['onSaveSuccess', 'update:modelValue'])
const menuTreeProp = {
  label: 'title',
  value: 'menuId',
}
const menuFormRef = ref()
const butFormRef = ref()
const drawerRef = ref()

/** 定义响应式变量 */
const state = reactive({
  disabledMenuEdit: false, // 禁用菜单编辑
  disabledButEdit: false, // 禁用按钮编辑
  type: '1', // 类型：'1'菜单 '0'按钮
  isUpdate: false, // 是否为修改
  saveLoading: false, // 保存按钮loading
  menus: [], // menuTree
  // 菜单form
  form: {
    isIframe: false, // 内嵌外链
    menuId: null,
    parentId: props.row.parentId || 0,
    title: '',
    type: '1',
    icon: '',
    orderNo: 0,
    routePath: '',
    routeName: '',
    component: '',
    isKeep: '0',
    isHide: '0',
    hideChildren: '0',
    isOuter: '0',
    fixedTab: '0',
    status: '1',
    description: '',
    iframeLink: '',
    perm: '',
    transition: '',
  },
  // 按钮form
  formBut: {
    menuId: null,
    parentId: props.row.parentId || 0,
    title: '',
    type: '0',
    orderNo: 0,
    perm: '',
    description: '',
    status: '1',
  },
})

function checkRoutePath(rule, value, callback) {
  if (!value)
    return callback(new Error('请输入路由地址'))

  if (!value.startsWith('/') && !value.startsWith('http:') && !value.startsWith('https:'))
    return callback(new Error('必须以 / 开头，外链必须以 http[s]: 开头'))

  return callback()
}
function checkIframeLink(rule, value, callback) {
  if (!value)
    return callback(new Error('请输入地址'))

  if (!value.startsWith('http:') && !value.startsWith('https:'))
    return callback(new Error('外链必须以 http[s]: 开头'))

  return callback()
}
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
  ],
  routePath: [
    { required: true, validator: checkRoutePath, trigger: 'blur' },
  ],
  iframeLink: [
    { required: true, validator: checkIframeLink, trigger: 'blur' },
  ],
}
const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
/** 定义方法 */
const methods = {
  beforeClose() {
    ElMessageBox.confirm(
      '此时关闭表单会丢失未提交的信息，是否确定要关闭表单？',
      '注意',
      {
        type: 'warning',
      },
    )
      .then(() => {
        value.value = false
      })
      .catch(() => {

      })
  },
  async initMenuTree() {
    const { data } = await getMenuTreeApi({ type: '1' })
    state.menus = [
      {
        title: '顶级',
        menuId: 0,
        children: [],
      },
      ...data,
    ]
  },
  async save(formEl) {
    if (!formEl)
      return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        state.saveLoading = true
        const { ok } = await saveMenuApi(state.type === '1' ? state.form : state.formBut)
        state.saveLoading = false
        ok && emit('onSaveSuccess')
      }
      else {
        console.error('error submit!', fields)
      }
    })
  },
  resetForm(formEl) {
    if (!formEl)
      return
    formEl.resetFields()
  },
  orderNoBlur(flag) {
    if (flag === 'but') {
      if (!state.formBut.orderNo)
        state.formBut.orderNo = 0
    }
    else {
      if (!state.form.orderNo)
        state.form.orderNo = 0
    }
  },
}
const drawerTitle = computed(() => {
  if (props.row.menuId || props.row.menuId === 0)
    return props.row.type === '0' ? '修改按钮' : '修改菜单'

  else
    return state.type === '0' ? '新增按钮' : '新增菜单'
})

nextTick(() => {
  if (props.row.menuId || props.row.menuId === 0) {
    state.type = props.row.type
    if (props.row.type === '1') {
      state.form = { ...props.row }
      state.disabledButEdit = true
    }

    else if (props.row.type === '0') {
      state.formBut = { ...props.row }
      state.disabledMenuEdit = true
    }
    state.form.isIframe = !!props.row.iframeLink

    state.isUpdate = true
  }
  methods.initMenuTree()
})
</script>

<template>
  <el-drawer
    ref="drawerRef" v-model="value" :before-close="methods.beforeClose" size="600px"
    :title="drawerTitle"
  >
    <el-tabs v-model="state.type" type="border-card">
      <el-tab-pane label="菜单" name="1" :disabled="state.disabledMenuEdit">
        <el-form ref="menuFormRef" :model="state.form" :rules="rules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                  v-model="state.form.parentId" filterable :data="state.menus" :props="menuTreeProp"
                  node-key="menuId" check-strictly
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="标题" prop="title">
                <el-input v-model="state.form.title" placeholder="标题" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item prop="icon" label="图标">
                <IconSelect v-model="state.form.icon" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="路由地址" prop="routePath">
                <template #label>
                  <div>
                    <el-tooltip content="以 / 开头，外链以 http[s]: 开头，多级路由必须全路径" placement="top-start">
                      <el-icon>
                        <QuestionFilled />
                      </el-icon>
                    </el-tooltip>
                    路由地址
                  </div>
                </template>
                <el-input v-model="state.form.routePath" placeholder="路由地址" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="路由name" prop="routeName">
                <template #label>
                  <div>
                    <el-tooltip content="建议与显式组件名对应，否则 keep 不生效" placement="top-start">
                      <el-icon>
                        <QuestionFilled />
                      </el-icon>
                    </el-tooltip>
                    路由name
                  </div>
                </template>
                <el-input v-model="state.form.routeName" placeholder="路由name" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="state.form.component" placeholder="组件路径">
                  <template #prepend>
                    @/views/
                  </template>
                  <template #append>
                    .vue
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="权限字符" prop="perm">
                <el-input v-model="state.form.perm" placeholder="权限字符" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="过渡效果" prop="transition">
                <el-select v-model="state.form.transition" placeholder="过渡效果" clearable filterable>
                  <el-option
                    v-for="item in transitionNames"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item label="排序" prop="orderNo">
                <el-input-number v-model="state.form.orderNo" controls-position="right" @blur="methods.orderNoBlur" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="内嵌外链" prop="isIframe">
                <el-switch v-model="state.form.isIframe" />
              </el-form-item>
            </el-col>
            <el-col :span="24" :offset="0">
              <el-form-item v-if="state.form.isIframe" label="内嵌外链地址" prop="iframeLink">
                <el-input v-model="state.form.iframeLink" placeholder="内嵌外链地址" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="固定tab" prop="fixedTab">
                <el-switch
                  v-model="state.form.fixedTab" active-value="1" inactive-value="0" active-text="固定"
                  inactive-text="不固定" inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="缓存组件" prop="isKeep">
                <el-switch
                  v-model="state.form.isKeep" active-value="1" inactive-value="0" active-text="缓存"
                  inactive-text="不缓存" inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="是否大屏" prop="isOuter">
                <template #label>
                  <div>
                    <el-tooltip content="框架外渲染" placement="top-start">
                      <el-icon>
                        <QuestionFilled />
                      </el-icon>
                    </el-tooltip>
                    是否大屏
                  </div>
                </template>
                <el-switch
                  v-model="state.form.isOuter" active-value="1" inactive-value="0" active-text="是"
                  inactive-text="否" inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="状态" prop="status">
                <el-switch
                  v-model="state.form.status" active-value="1" inactive-value="0" active-text="正常" inactive-text="停用"
                  inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="是否隐藏" prop="isHide">
                <el-switch
                  v-model="state.form.isHide" active-value="1" inactive-value="0" active-text="是"
                  inactive-text="否" inline-prompt
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item v-show="state.form.isHide === '1'" label="隐藏子级" prop="hideChildren">
                <el-switch
                  v-model="state.form.hideChildren" active-value="1" inactive-value="0" active-text="是"
                  inactive-text="否" inline-prompt
                />
              </el-form-item>
            </el-col>

            <el-col :span="24" :offset="0">
              <el-form-item label="描述" prop="description">
                <el-input v-model="state.form.description" type="textarea" placeholder="描述" :maxlength="120" show-word-limit :rows="4" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="按钮" name="0" :disabled="state.disabledButEdit">
        <el-form ref="butFormRef" :model="state.formBut" :rules="rules" label-width="120px">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              v-model="state.formBut.parentId" :data="state.menus" :props="menuTreeProp" node-key="menuId"
              check-strictly
            />
          </el-form-item>

          <el-form-item label="标题" prop="title">
            <el-input v-model="state.formBut.title" placeholder="标题" />
          </el-form-item>

          <el-form-item label="权限字符" prop="perm">
            <el-input v-model="state.formBut.perm" placeholder="权限字符" />
          </el-form-item>

          <el-form-item label="排序" prop="orderNo">
            <el-input-number
              v-model="state.formBut.orderNo" controls-position="right"
              @blur="methods.orderNoBlur('but')"
            />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="state.formBut.status" active-value="1" inactive-value="0" active-text="正常"
              inactive-text="停用" inline-prompt
            />
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input v-model="state.formBut.description" type="textarea" placeholder="描述" :maxlength="120" show-word-limit :rows="4" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button
        :loading="state.saveLoading" type="primary"
        @click="methods.save(state.type === '1' ? menuFormRef : butFormRef)"
      >
        提交
      </el-button>
      <el-button @click="methods.resetForm(state.type === '1' ? menuFormRef : butFormRef)">
        重置
      </el-button>
    </template>
  </el-drawer>
</template>
