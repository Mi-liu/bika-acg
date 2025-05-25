<script setup lang="ts">
import { weatherNow } from '@/api/seniverse'
import { isEmpty } from 'lodash-es'
import { getFileName } from '@/utils/file'

const { data } = useRequest(weatherNow)

const weatherImages = import.meta.glob<{ default: string }>('@/assets/image/seniverse/*.png', { eager: true })

const weatherImagesMap = new Map<string, string>(Object.entries(weatherImages).map(([key, value]) => {
  const { baseName } = getFileName(key)
  return [baseName, value.default]
}))

const nowWeather = computed(() => data.value)
</script>

<template>
  <div v-if="!isEmpty(nowWeather)" class="flex items-center">
    {{ nowWeather.location.name }}
    {{ nowWeather.now.text }}
    {{ nowWeather.now.temperature }}°C
    <img class="h-24px" :src="weatherImagesMap.get(nowWeather.now.code)">
  </div>
</template>
