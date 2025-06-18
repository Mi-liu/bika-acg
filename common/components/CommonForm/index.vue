<script setup lang="ts">
import type { AnyObject } from '../../type'
import type { CommonFormArrayColumns, CommonFormProps } from './type'

const props = defineProps<CommonFormProps>()

const formData = reactive<AnyObject>({})

const formItemsArray = computed(() => {
  let columns: CommonFormArrayColumns

  if (Array.isArray(props.columns)) {
    columns = props.columns
  }
  else {
    columns = Object.entries(props.columns).map(([key, value]) => {
      return {
        ...value,
        formItemProps: {
          prop: key,
          ...value.formItemProps,
        },
      }
    })
  }
  return columns.filter((item) => {
    if (item.visible) {
      return item.visible(formData)
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
    console.log(item.initValue)
    if (!Reflect.has(formData, item.formItemProps.prop) && item.initValue !== undefined) {
      Reflect.set(formData, item.formItemProps.prop, item.initValue)
    }
  })
})
</script>

<template>
  <div>
    <el-form :model="formData">
      {{ formData }}
      <el-form-item v-for="item in formItemsArray" :key="item.formItemProps.prop" v-bind="item.formItemProps">
        <el-input v-model="formData[item.formItemProps.prop]" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>
