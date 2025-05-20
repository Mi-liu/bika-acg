<script setup lang="ts">
import type { ComicsListProps } from './type'
import CommonPagination from '@common/components/CommonPagination/index.vue'
import Image from '@/components/Image/index.vue'
import { DEFAULT_PAGE_SIZE } from '@/config/pagination'
import { sort, defaultSort } from '@/constants/options'
import { getImageUrl } from '@/utils/string'
import type { SortOptionValue } from '@/constants/options'
import type { Comics } from '@/api/comic'
import { Timer } from '@element-plus/icons-vue'
import gsap from 'gsap'

const props = defineProps<ComicsListProps>()

const settingStore = useSettingStoreHook()

const CommonPaginationRef = useTemplateRef('CommonPaginationRef')

const loading = ref(false)

const data = ref<Comics['comics']>({
  docs: [],
  total: 0,
  page: 1,
  pages: 0,
  limit: DEFAULT_PAGE_SIZE,
})

const s = ref<SortOptionValue>(defaultSort);

function handelSelectChange(_event: SortOptionValue) {
  CommonPaginationRef.value?.reset();
}

async function handelPageChange(event: { currentPage: number }) {
  try {
    loading.value = true
    console.log(1, data.value);
    const result = await props.fetch({
      page: event.currentPage,
      c: encodeURIComponent(props.title),
      s: s.value,
    })
    data.value = result
  } finally {
    await nextTick()
    loading.value = false
  }
}
handelPageChange({
  currentPage: 1,
})

const comics = computed(() => data.value.docs.filter(item => {
  return !item.categories.some(tag => settingStore.comic.blockedCategories.includes(tag))
}))

async function handelCloseTag(tag: string) {
  await ElMessageBox.alert('是否屏蔽分类：' + tag, '提示', {
    showCancelButton: true,
  })
  if (settingStore.comic.blockedCategories.includes(tag)) {
    ElMessage.warning('分类已被屏蔽，请勿重复添加')
  } else {
    settingStore.comic.blockedCategories.push(tag)
    ElMessage.success('分类已被屏蔽')
  }
}

/**
 * GSAP 动画相关函数
 */
// 计算网格中的行和列
const calculateGridPosition = (index: number) => {
  // 估计每行显示的卡片数量，根据窗口宽度动态计算
  const itemsPerRow = Math.floor(window.innerWidth / 240) || 4
  const row = Math.floor(index / itemsPerRow)
  const col = index % itemsPerRow
  return { row, col, itemsPerRow }
}

// 元素进入前的初始状态
const onBeforeEnter = (el: Element) => {
  gsap.set(el, {
    opacity: 0,
    scale: 0.8, // 缩放初始值
    x: -30, // 从左侧开始
    y: 15, // 轻微的垂直偏移
    rotateZ: -2, // 轻微的旋转
    transformOrigin: 'center bottom'
  })
}

// 元素进入时的动画 - 根据索引依次从左到右进入，像卡片一样浮现
const onEnter = (el: Element, done: () => void) => {
  // 获取元素在父容器中的索引
  const index = Array.from(el.parentElement?.children || []).indexOf(el)

  // 计算行和列位置
  const { row, col } = calculateGridPosition(index)

  // 计算延迟，使同一行的卡片从左到右依次浮现
  const delay = (row * 0.06) + (col * 0.05)

  // 根据索引设置延迟，实现卡片式浮现效果
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotateZ: 0,
    duration: 0.4,
    delay: delay,
    ease: 'back.out(1.1)', // 使用back缓动函数，但减小参数值
    onComplete: done
  })
}

// 元素离开时的动画
const onLeave = (el: Element, done: () => void) => {
  // 获取元素在父容器中的索引
  const index = Array.from(el.parentElement?.children || []).indexOf(el)

  // 计算行和列位置
  const { col } = calculateGridPosition(index)

  gsap.to(el, {
    opacity: 0,
    scale: 0.9,
    y: 20, // 向下移动
    rotateZ: 1, // 轻微旋转
    duration: 0.3,
    delay: col * 0.03,
    ease: 'power1.in',
    onComplete: done
  })
}

// 元素移动时的动画
const onMove = (el: Element, done: () => void) => {
  gsap.to(el, {
    duration: 0.3,
    ease: 'power1.out',
    onComplete: done
  })
}

</script>

<template>
  <div class="comic-list size-full flex-1 flex flex-col">
    <div class="flex px py">
      <div class="size-full flex justify-between">
        <div class="text-18px">{{ title }}</div>
        <el-select class="w-110px!" v-model="s" @change="handelSelectChange">
          <el-option v-for="item in sort" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <CommonPagination ref="CommonPaginationRef" :total="data.total"
        layout="slot, ->, total, prev, pager, next, jumper" :page-size="DEFAULT_PAGE_SIZE" @change="handelPageChange">
      </CommonPagination>
    </div>
    <div class="h-full flex-1 overflow-hidden">
      <el-scrollbar height="100%">
        <TransitionGroup tag="div" class="comics-grid grid gap-20px pb" :css="false" @before-enter="onBeforeEnter"
          @enter="onEnter" @leave="onLeave" @move="onMove">
          <div class="comic-item rounded-2 overflow-hidden cursor-pointer p-3" v-for="item in comics" :key="item.id">
            <!-- 封面图 -->
            <div class="relative">
              <Image :src="getImageUrl(item.thumb.path)"></Image>
              <el-tooltip class="box-item" effect="dark" content="添加到稍后再看" placement="top-start">
                <div class="absolute top-2 right-2 w-30px h-30px bg-[--el-color-info] rounded-1 flex-center">
                  <el-icon class="text-[--el-color-white]!">
                    <Timer></Timer>
                  </el-icon>
                </div>
              </el-tooltip>
            </div>
            <!-- 标题 -->
            <div class="line-clamp-2 text-16px font-500 mt-2">
              {{ item.title }}
            </div>
            <!-- 章节信息 -->
            <div class="text-13px mt-1 text-[--el-text-color-secondary]">
              <el-text class="mx-1" type="primary" v-if="item.finished">[完结]</el-text> 共 {{ item.epsCount }}P
            </div>
            <!-- 作者 -->
            <div class="text-14px text-[--el-text-color-secondary] flex">
              作者:
              <div class="flex-1 flex gap-2 ml-2 flex-wrap">
                <el-link type="primary" underline="always" v-for="author in item.author.split(/[、, ，]/)">{{ author
                }}</el-link>
              </div>

            </div>
            <!-- 分类 -->
            <div class="mt-2 flex flex-wrap gap-2">
              <el-tag v-for="tag in item.categories" :key="tag" closable type="primary" effect="plain"
                @close="handelCloseTag(tag)">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </TransitionGroup>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comics-grid {
  grid-template-columns: repeat(auto-fill, 270px);
  justify-content: center;
  perspective: 1200px;
  /* 增强透视效果 */
  transform-style: preserve-3d;
  overflow: visible;
  /* 允许卡片溢出，增强立体感 */
  /* 添加内边距，为卡片浮现提供空间 */
  /* 整个网格容器居中 */
  width: 100%;
  /* 确保宽度占满容器 */
}

/* 动画相关样式 */
.comic-item {
  will-change: transform, opacity;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* 更有弹性的过渡 */
  transform-origin: center bottom;
  /* 从底部中心为变换原点，增强卡片感 */
  backface-visibility: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  /* 更明显的阴影，增强卡片感 */
  /* 增强卡片感 */
  position: relative;
  /* 确保z-index生效 */

  /* 添加卡片边框效果 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    /* 向上浮动，增强卡片感 */
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    /* 更明显的阴影 */
    z-index: 2;
  }
}
</style>
