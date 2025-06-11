<script setup lang="ts">
import type { CommonPopoverMenuProps } from '@common/components/CommonPopoverMenus/type'
import CommonPopoverMenus from '@common/components/CommonPopoverMenus/index.vue'

const props = defineProps<{
  author: string
}>()

const localStore = useLocalStoreHook()
const settingStore = useSettingStoreHook()

const router = useRouter()

const isFollowAuthor = computed(() => {
  return localStore.local.FOLLOW_AUTHOR_LIST.includes(props.author)
})

const menus = computed<CommonPopoverMenuProps['menus']>(() => {
  // 是否关注
  if (isFollowAuthor.value) {
    return [
      { label: '取消关注', type: 'info', onClick: () => {
        localStore.removeItem('FOLLOW_AUTHOR_LIST', props.author)
      } },
    ]
  }
  // 是否屏蔽
  else if (settingStore.filter.authors.includes(props.author)) {
    return [
      { label: '取消屏蔽', type: 'info', onClick: () => {
        settingStore.filter.authors.splice(settingStore.filter.authors.indexOf(props.author), 1)
      } },
    ]
  }
  else {
    return [
      { label: '关注', type: 'primary', onClick: () => {
        localStore.pushItem('FOLLOW_AUTHOR_LIST', props.author)
      } },
      { label: '屏蔽', type: 'danger', onClick: () => {
        settingStore.filter.authors.push(props.author)
      } },
    ]
  }
})

function handleAuthorClick(author: string) {
  const url = router.resolve({
    path: '/comic/list',
    query: {
      author,
    },
  }).href
  window.open(url, '_blank')
}
</script>

<template>
  <CommonPopoverMenus :menus="menus">
    <el-link type="primary" underline="always" @click.stop="handleAuthorClick(author)">
      {{ author }}
    </el-link>
  </CommonPopoverMenus>
</template>

<style lang="scss" scoped>

</style>
