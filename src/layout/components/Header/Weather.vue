<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { weatherNow } from '@/api/seniverse'
import { getFileName } from '@/utils/file'

const { data, run } = useRequest(weatherNow, {
  manual: true,
  // defaultParams: ['ip'],
})

const weatherImages = import.meta.glob<{ default: string }>('@/assets/image/seniverse/*.png', { eager: true })

const weatherImagesMap = new Map<string, string>(Object.entries(weatherImages).map(([key, value]) => {
  const { baseName } = getFileName(key)
  return [baseName, value.default]
}))

navigator.permissions.query({ name: 'geolocation' }).then((res) => {
  if (res.state === 'granted' || res.state === 'prompt') {
    useSystemPositioning()
  }
  else if (res.state === 'denied') {
    // 用户拒绝浏览器位置权限，使用ip查询
    run('ip')
  }
})

function useSystemPositioning() {
  navigator.geolocation.getCurrentPosition((e) => {
    run(`${e.coords.latitude}:${e.coords.longitude}`)
  }, () => {
    run('ip')
  })
}

// navigator.geolocation.getCurrentPosition((e)=>{
//   console.log(e);
// }, err=>{
//   console.log(err);
// });

const nowWeather = computed(() => data.value)
</script>

<template>
  <div v-if="!isEmpty(nowWeather)" class="flex items-center select-none">
    <!-- {{ nowWeather.location.name }} -->
    {{ nowWeather.now.text }}
    {{ nowWeather.now.temperature }}°C
    <img class="h-20px ml-1.5" :src="weatherImagesMap.get(nowWeather.now.code)">
  </div>
</template>
