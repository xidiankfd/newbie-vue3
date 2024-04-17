<!--
基于 el-tree 改造的树列表组件

属性：
  v-model 绑定的值
  data 数据源
  treeProps 数据字段映射：
          label 显示的字段
          id 节点唯一值的key
          children 节点子级标识的key
          disabled 不可选节点
          isLeaf 是否为叶子节点，懒加载下生效，组件暂不支持懒加载，有需要时增加此功能
          class 自定义节点类名

  emptyText 空数据展示文本
  defaultExpandAll 默认全部展开
  leftTitle 左侧标题
  rightTitle 右侧标题
  filterable 过滤查询树节点
  showCheckbox 是否显示复选框，多选
  loading 加载状态
  checkStrictly 父子独立

事件：
  nodeClick 仅单选模式生效，当节点被点击的时候触发
  check 仅多选选模式生效，点击节点复选框之后触发
-->

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import useCutTree from 'cut-tree'
import SvgIcon from '@/components/svg-icon/index.vue'
import { useAppStore } from '@/stores/modules/app'

defineOptions({
  name: 'ElTreeList',
})

const props = defineProps({
  modelValue: { type: [Array, String, Number] },
  title: { type: String, default: '标题' },
  data: { type: Array, default: () => [] },
  treeProps: {
    type: Object,
    default: () => {
      return {
        label: 'label',
        id: 'id',
        children: 'children',
        disabled: 'disabled',
        isLeaf: 'isLeaf',
        class: 'class',
      }
    },
  },
  emptyText: { type: String, default: '暂无数据' },
  defaultExpandAll: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  showCheckbox: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  checkStrictly: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'nodeClick', 'check'])
const appStore = useAppStore()
const treeRef = ref()
const { forEach } = useCutTree({ id: props.treeProps.id, children: props.treeProps.children })
/** 定义响应式数据 */
const state = reactive({
  keyword: '', // 过滤关键字
  allCheck: false, // 全选框全选状态
  indeterminate: false, // 全选框半选状态
  checkStrictly: props.checkStrictly, // 父子不互相关联
  nodeTotal: 0, // 节点总数量
})
let timer
/** 定义方法 */
const methods = {
  // 全选/取消全选 点击事件
  onAllCheckClick(checked) {
    checked = checked === undefined ? !state.allCheck : checked
    state.indeterminate = false
    state.allCheck = checked
    methods.allCheck(state.allCheck)
  },
  // 全选/取消全选
  allCheck(checked) {
    if (!treeRef.value?.data)
      return
    forEach(treeRef.value.data, (item) => {
      treeRef.value.setChecked(item[props.treeProps.id], checked)
    })
    emit('update:modelValue', checked ? treeRef.value.getCheckedKeys() : [])
  },
  // 功能按钮
  command(val) {
    if (val === 'expandAll') {
      const nodeMap = treeRef.value.store.nodesMap
      for (const i in nodeMap)
        nodeMap[i].expanded = true
    }
    else if (val === 'mergeAll') {
      const nodeMap = treeRef.value.store.nodesMap
      for (const i in nodeMap)
        nodeMap[i].expanded = false
    }
    else if (val === 'notGanged') {
      state.checkStrictly = true
    }
    else if (val === 'ganged') {
      state.checkStrictly = false
    }
  },
  // 复选框点击事件
  check(v1, v2) {
    if (!props.showCheckbox)
      return
    const allArr = [...v2.checkedKeys, ...v2.halfCheckedKeys]
    emit('update:modelValue', allArr)
    emit('check', v1, v2)

    if (!allArr.length) {
      state.indeterminate = false
      state.allCheck = false
    }
    else if (allArr.length === state.nodeTotal) {
      state.indeterminate = false
      state.allCheck = true
    }
    else {
      state.allCheck = false
      state.indeterminate = true
    }
  },
  // 节点点击事件
  nodeClick(node) {
    if (props.showCheckbox)
      return
    emit('update:modelValue', node[props.treeProps.id])
    emit('nodeClick', node)
  },
  filterNodeMethod(value, data) {
    if (!value)
      return true
    return data[props.treeProps.label].includes(value)
  },
  // 初始化选中状态
  initStatus() {
    if (!props.data?.length)
      return

    if (props.showCheckbox) {
      let i = 0
      forEach(props.data, () => {
        i++
      })
      state.nodeTotal = i
      if (props.modelValue?.length) {
        forEach(props.data, (item) => {
          forEach(props.modelValue, (id) => {
            if (item[props.treeProps.id] === id)
              treeRef.value.setChecked(id, true, false)
          })
        })
        if (props.modelValue.length === i)
          state.allCheck = true
        else
          state.indeterminate = true
      }
      else {
        methods.onAllCheckClick(false)
      }
    }
    else {
      if (props.modelValue || props.modelValue === 0)
        treeRef.value.setCurrentKey(props.modelValue)
    }
  },
  init() {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      methods.initStatus()
    }, 50)
  },
}
onMounted(() => {

})

/** 监听树过滤关键字 */
watch(() => state.keyword, (v) => {
  if (treeRef.value)
    treeRef.value.filter(v)
})
watch(() => props.data, (v) => {
  if (v?.length)
    methods.init()
})
watch(() => props.modelValue, (v) => {
  if (v?.length)
    methods.init()
})
</script>

<template>
  <el-card :shadow="appStore.appConfig.elChardShadow">
    <template #header>
      <div class="flex items-center justify-between ">
        <el-checkbox v-if="showCheckbox" name="el-tree-list-all-checkbox" :model-value="state.allCheck" :indeterminate="state.indeterminate" :label="title" @click="methods.onAllCheckClick(undefined)" />
        <span v-else>{{ title }}</span>
        <el-dropdown @command="methods.command">
          <span class="el-dropdown-link">
            <el-icon :size="18">
              <SvgIcon name="ic:round-more-vert" />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="expandAll">
                展开所有
              </el-dropdown-item>
              <el-dropdown-item command="mergeAll">
                合并所有
              </el-dropdown-item>
              <el-dropdown-item v-if="showCheckbox" divided command="ganged" :disabled="!state.checkStrictly">
                父子联动
              </el-dropdown-item>
              <el-dropdown-item v-if="showCheckbox" command="notGanged" :disabled="state.checkStrictly">
                父子独立
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
    <el-input v-if="filterable" v-model="state.keyword" placeholder="请输入关键字" clearable style="margin-bottom: 10px;" />
    <el-scrollbar style="height: calc(100% - 40px);">
      <el-tree
        ref="treeRef"
        v-loading="loading"
        :data="data"
        :props="treeProps"
        :empty-text="emptyText"
        :node-key="treeProps.id"
        highlight-current
        :default-expand-all="defaultExpandAll"
        :show-checkbox="showCheckbox"
        :filter-node-method="methods.filterNodeMethod"
        :check-strictly="state.checkStrictly"
        :expand-on-click-node="false"
        @node-click="methods.nodeClick"
        @check="methods.check"
      >
        <template #default="scope">
          <slot :data="scope.data">
            <span>{{ scope.data[treeProps.label] }}</span>
          </slot>
        </template>
      </el-tree>
    </el-scrollbar>
  </el-card>
</template>

<style scoped>
:deep(.el-card__body){
  padding:10px 10px;
  height: calc(100% - 50px);
}
:deep(.el-card__header){
  padding: 10px 15px;
}
</style>
