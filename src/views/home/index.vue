<script setup>
import packagejson from '/package.json'
import { shallowRef } from 'vue'

defineOptions({ name: 'Home' })
const dependencies = shallowRef([])
const devDependencies = shallowRef([])

Object.keys(packagejson.dependencies).forEach((key) => {
  dependencies.value.push({
    name: key,
    version: packagejson.dependencies[key],
  })
})

Object.keys(packagejson.devDependencies).forEach((key) => {
  devDependencies.value.push({
    name: key,
    version: packagejson.devDependencies[key],
  })
})
</script>

<template>
  <el-container>
    <el-main>
      欢迎使用NewbieBoot
    </el-main>
  </el-container>
</template>
