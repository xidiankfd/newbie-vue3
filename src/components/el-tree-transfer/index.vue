<!--
基于 el-transfer 改造的树穿梭框组件

属性：
  v-model 绑定右侧树，选择的值
  data 绑定左侧树，数据源
  treeProps 数据字段映射：
          label: 显示的字段
          id: 节点唯一值的key
          pid: 节点父级标识的key
          children: 节点子级标识的key
          disabled 不可选节点
          isLeaf 是否为叶子节点，懒加载下生效，组件暂不支持懒加载，有需要时增加此功能
          class 自定义节点类名

  leftTitle 左侧标题
  rightTitle 右侧标题
  emptyText 空数据展示文本
  defaultExpandAll 默认全部展开
  sortKey 排序字段映射
  checkFull 只移动全选节点，半选节点不移动
  leftLoading 左树加载状态
  rightLoading 右树加载状态
  filterable 过滤查询树节点
-->
<script setup>
import { reactive, ref, watch } from 'vue'
import useCutTree from 'cut-tree'
import { cloneDeep } from 'lodash'

defineOptions({
  name: 'ElTreeTransfer',
})
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  treeProps: {
    type: Object,
    default: () => {
      return {
        label: 'label',
        id: 'id',
        pid: 'pid',
        children: 'children',
        disabled: 'disabled',
        isLeaf: 'isLeaf',
        class: 'class',
      }
    },
  },
  leftTitle: { type: String, default: '数据1' },
  rightTitle: { type: String, default: '数据2' },
  emptyText: { type: String, default: '暂无数据' },
  defaultExpandAll: { type: Boolean, default: false },
  sortKey: { type: String, default: undefined },
  checkFull: { type: Boolean, default: false },
  leftLoading: { type: Boolean, default: false },
  rightLoading: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const { treeToList, listToTree, forEach } = useCutTree({ id: props.treeProps.id, pid: props.treeProps.pid, children: props.treeProps.children })
const leftTreeRef = ref() // 左侧树实例
const rightTreeRef = ref() // 右侧树实例
const state = reactive({
  dataSource: [],
  toRightButDisabled: true,
  toLeftButDisabled: true,
  left: {
    allCheck: false, // 全选
    indeterminate: false, // 半选
    nodeTotal: 0, // 节点总数
    checkNodeCount: 0, // 选中的节点数量
    keyword: '', // 树节点过滤关键字
  },
  right: {
    allCheck: false, // 全选
    indeterminate: false, // 半选
    nodeTotal: 0, // 节点总数
    checkNodeCount: 0, // 选中的节点数量
    keyword: '', // 树节点过滤关键字
  },
})
const methods = {
  // 左/右移按钮点击事件
  onButClick(direction) {
    let treeRef, allArr
    if (direction === 'to left') {
      treeRef = rightTreeRef.value
      // 所有 半选、全选、原数据 的值
      allArr = [...treeToList(leftTreeRef.value.data), ...treeRef.getCheckedNodes()]
    }
    else if (direction === 'to right') {
      treeRef = leftTreeRef.value
      // 所有 半选、全选、原数据 的值
      allArr = [...treeToList(rightTreeRef.value.data), ...treeRef.getCheckedNodes()]
    }
    if (!props.checkFull)
      allArr.push(...treeRef.getHalfCheckedNodes())

    const arr = treeRef.getCheckedNodes() // 获取全部选中的节点

    // 遍历选中的节点
    arr.forEach((node) => {
      // 将选中的节点移除
      treeRef.remove(node)
    })
    // 将所有半选状态取消
    treeRef.getHalfCheckedKeys().forEach((key) => {
      treeRef.setChecked(key, false)
    })

    if (props.sortKey)
      allArr = allArr.sort((a, b) => a[props.sortKey] - b[props.sortKey])

    if (direction === 'to left') {
      emit('update:modelValue', [...treeRef.data])
      state.dataSource = methods.resetTree(allArr)
    }
    else if (direction === 'to right') {
      emit('update:modelValue', methods.resetTree(allArr))
    }

    setTimeout(() => {
      methods.initCount('left')
      methods.initCount('right')
      methods.onAllCheckClick('left', false)
      methods.onAllCheckClick('right', false)
    }, 0)
  },
  // 重置树
  resetTree(treeData) {
    treeData = cloneDeep(treeData)
    treeData.forEach((item) => {
      item[props.treeProps.children] = []
    })
    treeData = methods.objArrayduplicateRemoval(treeData, props.treeProps.id)
    const arr = treeToList(treeData)

    return listToTree(arr)
  },
  // js数组根据某个key去重
  objArrayduplicateRemoval(arr, key) {
    const obj = {}
    const results = []
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i][key]]) {
        results.push(arr[i])
        obj[arr[i][key]] = true
      }
    }
    return results
  },
  // 全选/取消全选 点击事件
  onAllCheckClick(targer, checked) {
    checked = checked === undefined ? !state[targer].allCheck : checked
    state[targer].indeterminate = false
    state[targer].allCheck = checked
    methods.allCheck(targer, state[targer].allCheck)
  },
  // 统计左侧节点数量
  initCount(targer) {
    state[targer].checkNodeCount = 0
    const treeRef = targer === 'left' ? leftTreeRef.value : rightTreeRef.value
    let i = 0
    forEach(treeRef.data, () => {
      i++
    })
    state[targer].nodeTotal = i
  },
  // 全选/取消全选
  allCheck(targer, checked) {
    const treeRef = targer === 'left' ? leftTreeRef.value : rightTreeRef.value
    treeRef.data(treeRef.data, (item) => {
      treeRef.setChecked(item[props.treeProps.id], checked)
    })
    state[targer].checkNodeCount = checked ? state[targer].nodeTotal : 0
  },
  // 节点被点击
  onCheck(targer) {
    const treeRef = targer === 'left' ? leftTreeRef.value : rightTreeRef.value
    const arr = [...treeRef.getCheckedKeys(), ...treeRef.getHalfCheckedKeys()]
    state[targer].checkNodeCount = arr.length
    if (state[targer].nodeTotal === arr.length) {
      state[targer].indeterminate = false
      state[targer].allCheck = true
    }
    else {
      state[targer].indeterminate = !!arr.length
      state[targer].allCheck = false
    }
  },
  // 初始化数据源
  initDataSource() {
    let arr = []
    forEach(props.modelValue, item => arr.push(item))
    arr = arr.reverse()
    arr.forEach((item) => {
      forEach(leftTreeRef.value.data, (node) => {
        if (item[props.treeProps.id] === node[props.treeProps.id] && !node[props.treeProps.children]?.length)
          leftTreeRef.value.remove(node)
      })
    })
    methods.initCount('left')
    methods.initCount('right')
  },
  leftFilterNode(value, data) {
    if (!value)
      return true
    return data[props.treeProps.label].includes(value)
  },
  rightFilterNode(value, data) {
    if (!value)
      return true
    return data[props.treeProps.label].includes(value)
  },
  init() {

  },
}
/** 监听左侧选中节点的数量变化 */
watch(() => state.left.checkNodeCount, (v) => {
  state.toRightButDisabled = !v
})
/** 监听右侧选中节点的数量变化 */
watch(() => state.right.checkNodeCount, (v) => {
  state.toLeftButDisabled = !v
})
watch(() => props.data, (v) => {
  if (!v?.length)
    return
  state.dataSource = v
  setTimeout(() => {
    if (props.modelValue?.length)
      methods.initDataSource()
    else
      methods.initCount('left')
  }, 0)
}, { immediate: true })
watch(() => props.modelValue, (v) => {
  if (!v?.length)
    return
  setTimeout(() => {
    if (state.dataSource?.length)
      methods.initDataSource()
    else
      methods.initCount('right')
  }, 0)
}, { immediate: true })

/** 监听左侧过滤关键字 */
watch(() => state.left.keyword, (v) => {
  if (leftTreeRef.value)
    leftTreeRef.value.filter(v)
})
/** 监听右侧过滤关键字 */
watch(() => state.right.keyword, (v) => {
  if (rightTreeRef.value)
    rightTreeRef.value.filter(v)
})
</script>

<template>
  <div class="el-transfer">
    <div class="el-transfer-panel">
      <p class="el-transfer-panel__header">
        <el-checkbox
          name="el-tree-transfer-left-checkbox"
          :model-value="state.left.allCheck" :indeterminate="state.left.indeterminate"
          @click="methods.onAllCheckClick('left')"
        >
          {{ leftTitle }}
          <span>
            {{ `${state.left.checkNodeCount}/${state.left.nodeTotal}` }}
          </span>
        </el-checkbox>
      </p>
      <div class="el-transfer-panel__body">
        <el-scrollbar height="100%" style="padding: 5px 12px 0 12px;">
          <el-input v-if="filterable" v-model="state.left.keyword" placeholder="请输入关键字" clearable />
          <el-tree
            ref="leftTreeRef"
            v-loading="leftLoading"
            style="margin-top: 5px;"
            :data="state.dataSource" show-checkbox :node-key="treeProps.id" :props="treeProps"
            :default-expand-all="defaultExpandAll"
            :empty-text="emptyText"
            :filter-node-method="methods.leftFilterNode"
            @check="methods.onCheck('left')"
          />
        </el-scrollbar>
      </div>
    </div>
    <div class="el-transfer__buttons">
      <el-button
        :disabled="state.toLeftButDisabled"
        type="primary"
        @click="methods.onButClick('to left')"
      >
        <span class=""><i class="el-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"
          />
        </svg></i></span>
      </el-button>
      <el-button
        :disabled="state.toRightButDisabled"
        type="primary"
        @click="methods.onButClick('to right')"
      >
        <!-- v-if --><span class=""><!-- v-if --><i class="el-icon"><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="currentColor"
            d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
          />
        </svg></i></span>
      </el-button>
    </div>
    <div class="el-transfer-panel">
      <p class="el-transfer-panel__header">
        <el-checkbox
          name="el-tree-transfer-right-checkbox"
          :model-value="state.right.allCheck" :indeterminate="state.right.indeterminate"
          @click="methods.onAllCheckClick('right')"
        >
          {{ rightTitle }}
          <span>
            {{ `${state.right.checkNodeCount}/${state.right.nodeTotal}` }}
          </span>
        </el-checkbox>
      </p>
      <div class="el-transfer-panel__body">
        <el-scrollbar height="100%" style="padding: 5px 12px 0 12px;">
          <el-input v-if="filterable" v-model="state.right.keyword" placeholder="请输入关键字" clearable />
          <el-tree
            ref="rightTreeRef"
            v-loading="rightLoading"
            style="margin-top: 5px;"
            :data="modelValue" show-checkbox :node-key="treeProps.id" :props="treeProps"
            :default-expand-all="defaultExpandAll"
            :empty-text="emptyText"
            :filter-node-method="methods.rightFilterNode"
            @check="methods.onCheck('right')"
          />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
