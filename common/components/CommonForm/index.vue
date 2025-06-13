<script setup lang="ts" generic="T extends AnyObject = { [key: string]: any }">
import type { AnyObject } from '../../type'
import type { CommonFormProps } from './type'
import { cloneDeep } from 'lodash-es'
import { computed, reactive, toRaw, useTemplateRef, watchEffect } from 'vue'

const props = defineProps<CommonFormProps<T>>()

const formData = reactive<Partial<T>>({})

/**
 * 将响应式对象转换为普通对象，用于 el-form 的 model 属性
 * 这样可以避免类型错误，同时保持响应性
 */
const formModel = computed(() => toRaw(formData) as Record<string, any>)

const formItemsArray = computed(() => {
  if (Array.isArray(props.items)) {
    return props.items
  }
  else {
    return Object.entries(props.items).map(([key, value]) => {
      return {
        ...value,
        formItemProps: {
          prop: key,
          ...value.formItemProps,
        },
      }
    })
  }
})

watchEffect(() => {
  formItemsArray.value.forEach((item) => {
    if (!Reflect.has(formData, item.formItemProps.prop)) {
      Reflect.set(formData, item.formItemProps.prop, item.defaultValue)
    }
  })
  console.log(formData)
})

const elFormRef = useTemplateRef('elFormRef')

async function handleSearch() {
  await elFormRef.value?.validate()
  submit()
}

async function submit() {
  const formatData = getFormatterFormData()
  console.log(formatData)
}

/** 获取格式化后的表单数据 */
function getFormatterFormData() {
  const formatData = cloneDeep(toRaw(formData)) as Partial<T>
  formItemsArray.value.forEach((item) => {
    if (item.formatValue) {
      formatData[item.formItemProps.prop] = item.formatValue(formatData[item.formItemProps.prop], formatData)
    }
  })
  return formatData
}
</script>

<template>
  <el-form ref="elFormRef" :model="formModel">
    {{ formData }}
    <el-form-item v-for="item in formItemsArray" :key="item.formItemProps.prop" v-bind="item.formItemProps">
      1
      <!-- <component :is="item.is" v-bind="item.props" /> -->
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">
        搜索
      </el-button>
      <el-button type="default">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>

</style>
