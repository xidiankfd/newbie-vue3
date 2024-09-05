<script setup>
import { getDictDataListByTypeCodeApi } from '@/api/system/dictData'
import { onMounted, reactive,computed } from 'vue'
defineOptions({
    name: 'DictTag',
})
const props = defineProps({
    // 字典类型编码
    typeCode: {
        type: String,
        required: true
    }
})

const model = defineModel()
const state = reactive({
    options: []
})

function initData() {
    getDictDataListByTypeCodeApi(props.typeCode).then(res => {
        state.options = res.data
    })
}

const type = computed(() => state.options.find(item => item.value === model.value)?.eleType || '');
const label = computed(() => state.options.find(item => item.value === model.value)?.label);

onMounted(() => {
    initData();
})
</script>

<template>
    <el-tag :type="type">
        {{ label }}
    </el-tag>
</template>
