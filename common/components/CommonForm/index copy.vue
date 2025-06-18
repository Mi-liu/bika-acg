<script setup lang="ts" generic="T extends AnyObject = { [key: string]: any }">
import type { AnyObject } from '../../type'
import type { CommonFormArrayItems, CommonFormProps } from './type'
import { cloneDeep } from 'lodash-es'
import { computed, readonly, toRaw, useTemplateRef, watchEffect } from 'vue'
import CommonComponent from '../CommonComponent/index.vue'

const props = defineProps<CommonFormProps<T>>()

const emit = defineEmits<{
  submit: [data: T]
}>()

const formData = reactive<T>({} as T)

const formItemsArray = computed(() => {
  let items: CommonFormArrayItems<T>

  if (Array.isArray(props.items)) {
    items = props.items
  }
  else {
    items = Object.entries(props.items).map(([key, value]) => {
      return {
        ...value,
        formItemProps: {
          prop: key,
          ...value.formItemProps,
        },
      }
    })
  }
  return items.filter((item) => {
    if (item.visible) {
      return item.visible(formData.value)
    }
    return true
  })
})

/**
 * 初始化表单字段
 * 确保所有配置的字段都在 formData 中存在
 */
watchEffect(() => {
  formItemsArray.value.forEach((item) => {
    if (!Reflect.has(formData, item.formItemProps.prop)) {
      Reflect.set(formData, item.formItemProps.prop, undefined)
    }
  })
})

const elFormRef = useTemplateRef('elFormRef')

async function handleSearch() {
  await elFormRef.value?.validate()
  submit()
}

async function handleReset() {
  await elFormRef.value?.resetFields()
  submit()
}

async function submit() {
  const formatData = getFormatterFormData()
  emit('submit', formatData)
}

/** 获取格式化后的表单数据 */
function getFormatterFormData() {
  const formatData = cloneDeep(toRaw(formData)) as T
  formItemsArray.value.forEach((item) => {
    if (item.formatValue) {
      const formattedValue = item.formatValue(formatData[item.formItemProps.prop], formatData)
      if (formattedValue !== undefined) {
        Object.assign(formatData, {
          [item.formItemProps.prop]: formattedValue,
        })
      }
    }
  })
  return formatData
}

defineExpose({
  submit,
  getFormatterFormData,
  formData: readonly(formData),
})
</script>

<template>
  <el-form ref="elFormRef" :model="formData">
    {{ formData }}
    <el-form-item v-for="item in formItemsArray" :key="item.formItemProps.prop" v-bind="item.formItemProps">
      <slot
        :name="item.formItemProps.prop"
        :form-data="formData"
        :props="item.props"
        :model-value="formData[item.formItemProps.prop]"
      >
        <el-input v-model="formData[item.formItemProps.prop]" />
        <!-- @vue-ignore -->
        <CommonComponent
          :is="item.is"
          v-model="formData[item.formItemProps.prop]"
          :props="item.props"
        />
      </slot>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">
        搜索
      </el-button>
      <el-button type="default" @click="handleReset">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>

</style>
