<script setup>
import { getDictDataListByTypeCodeApi } from '@/api/system/dictData'
import { onMounted, reactive } from 'vue'
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

function initData() {
    getDictDataListByTypeCodeApi(props.typeCode).then(res => {
        state.options = res.data
        if (props.autoDef && !model.value && model.value !== 0) {
            const defaultOption = state.options.find(item => item.def === 'Y')
            if (defaultOption) {
                model.value = defaultOption.value
            }
        }
    })
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
