<script setup>
import { getDictDataListByTypeCodeApi } from '@/api/system/dictData'
import { onMounted, reactive } from 'vue'
import { sessionCache } from '@/utils/cache'
defineOptions({
    name: 'DictSelect',
})
const props = defineProps({
    // 字典类型编码
    typeCode: {
        type: String,
        required: true
    },
    // 是否自动选择默认值
    autoDef: {
        type: Boolean,
        default: true
    }
})

const model = defineModel()
const state = reactive({
    options: []
})

function autoDefault() {
    if (props.autoDef && !model.value && model.value !== 0) {
        const defaultOption = state.options.find(item => item.def === 'Y')
        if (defaultOption) {
            model.value = defaultOption.value
        }
    }
}

function initData() {
    if (sessionCache.has(`dictData_${props.typeCode}`)) {
        state.options = sessionCache.get(`dictData_${props.typeCode}`)
        autoDefault()
    } else {
        getDictDataListByTypeCodeApi(props.typeCode).then(res => {
            state.options = res.data
            autoDefault()
        })
    }
}
onMounted(() => {
    initData()
})
</script>

<template>
    <el-select v-model="model" placeholder="请选择">
        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

</template>
