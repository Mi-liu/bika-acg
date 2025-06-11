<script setup lang="ts">
import type { CommonPopoverMenuProps } from '@common/components/CommonPopoverMenus/type'
import CommonPopoverMenus from '@common/components/CommonPopoverMenus/index.vue'

const props = defineProps<{
  author: string
}>()

const localStore = useLocalStoreHook()

const router = useRouter()

const isFollowAuthor = computed(() => {
  return localStore.local.FOLLOW_AUTHOR_LIST.includes(props.author)
})

const menus = computed<CommonPopoverMenuProps['menus']>(() => {
  if (isFollowAuthor.value) {
    return [
      { label: '取消关注', type: 'info', onClick: () => {
        localStore.removeItem('FOLLOW_AUTHOR_LIST', props.author)
      } },
    ]
  }
  else {
    return [
      { label: '关注', type: 'primary', onClick: () => {
        localStore.pushItem('FOLLOW_AUTHOR_LIST', props.author)
      } },
      { label: '屏蔽', type: 'danger', onClick: () => {

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
