import { computed, onUnmounted, ref, watch } from 'vue'

/**
 * 自动阅读配置接口
 */
export interface AutoReadOptions {
  /** 是否启用自动阅读 */
  enabled: boolean | Ref<boolean> | ComputedRef<boolean>
  /** 滚动速度（像素/秒） */
  speed: number | Ref<number> | ComputedRef<number>
  /** 滚动容器元素 */
  container?: HTMLElement | Ref<HTMLElement | undefined> | ComputedRef<HTMLElement | undefined>
  /** 手动滚动后恢复自动滚动的延迟时间（毫秒） */
  resumeDelay?: number
}

/**
 * 自动阅读状态接口
 */
export interface AutoReadState {
  /** 是否正在自动滚动 */
  isAutoScrolling: boolean
  /** 是否因鼠标悬停而暂停 */
  isPausedByHover: boolean
  /** 是否因手动滚动而暂停 */
  isPausedByManualScroll: boolean
  /** 当前滚动位置 */
  scrollTop: number
}

/**
 * 自动阅读 Composable
 * @param options 自动阅读配置
 * @returns 自动阅读控制方法和状态
 */
export function useAutoRead(options: AutoReadOptions) {
  // 响应式状态
  const state = reactive<AutoReadState>({
    isAutoScrolling: false,
    isPausedByHover: false,
    isPausedByManualScroll: false,
    scrollTop: 0,
  })

  // 内部状态
  let animationFrameId: number | null = null
  let resumeTimeoutId: number | null = null
  let lastScrollTime = 0
  let lastManualScrollTime = 0

  // 响应式配置
  const enabled = computed(() => unref(options.enabled))
  const speed = computed(() => unref(options.speed))
  const container = computed(() => unref(options.container))

  // 计算属性：是否应该自动滚动
  const shouldAutoScroll = computed(() => {
    return enabled.value
      && !state.isPausedByHover
      && !state.isPausedByManualScroll
  })

  /**
   * 获取滚动容器
   */
  function getScrollContainer(): HTMLElement {
    return container.value || document.documentElement
  }

  /**
   * 执行自动滚动
   */
  function performAutoScroll() {
    if (!shouldAutoScroll.value) {
      state.isAutoScrolling = false
      return
    }

    const container = getScrollContainer()
    const currentTime = performance.now()
    const deltaTime = currentTime - lastScrollTime
    lastScrollTime = currentTime

    // 计算滚动距离（像素/秒 转换为 像素/毫秒）
    const scrollDistance = (speed.value / 1000) * deltaTime

    // 更新滚动位置
    state.scrollTop += scrollDistance
    container.scrollTop = state.scrollTop

    // 检查是否已滚动到底部
    const { scrollHeight, clientHeight } = container
    if (state.scrollTop >= scrollHeight - clientHeight) {
      // 已滚动到底部，停止自动滚动
      stop()
      return
    }

    state.isAutoScrolling = true
    animationFrameId = requestAnimationFrame(performAutoScroll)
  }

  /**
   * 开始自动滚动
   */
  function start() {
    if (state.isAutoScrolling || !enabled.value)
      return

    const container = getScrollContainer()
    state.scrollTop = container.scrollTop
    lastScrollTime = performance.now()

    performAutoScroll()
  }

  /**
   * 停止自动滚动
   */
  function stop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    state.isAutoScrolling = false
  }

  /**
   * 暂停自动滚动（鼠标悬停）
   */
  function pauseByHover() {
    state.isPausedByHover = true
  }

  /**
   * 恢复自动滚动（鼠标离开）
   */
  function resumeByHover() {
    state.isPausedByHover = false
    if (shouldAutoScroll.value && !state.isAutoScrolling) {
      start()
    }
  }

  /**
   * 处理手动滚动事件
   */
  function handleManualScroll() {
    const currentTime = performance.now()

    // 如果正在自动滚动，检查是否为手动滚动
    if (state.isAutoScrolling) {
      const container = getScrollContainer()
      const actualScrollTop = container.scrollTop

      // 如果实际滚动位置与预期位置差异较大，认为是手动滚动
      if (Math.abs(actualScrollTop - state.scrollTop) > 10) {
        state.isPausedByManualScroll = true
        state.scrollTop = actualScrollTop
        lastManualScrollTime = currentTime

        // 清除之前的恢复定时器
        if (resumeTimeoutId) {
          clearTimeout(resumeTimeoutId)
        }

        // 设置恢复定时器
        resumeTimeoutId = setTimeout(() => {
          state.isPausedByManualScroll = false
          if (shouldAutoScroll.value) {
            start()
          }
        }, options.resumeDelay || 1000)
      }
    }
    else {
      // 更新当前滚动位置
      const container = getScrollContainer()
      state.scrollTop = container.scrollTop
    }
  }

  /**
   * 切换自动滚动状态
   */
  function toggle() {
    if (state.isAutoScrolling) {
      stop()
    }
    else if (shouldAutoScroll.value) {
      start()
    }
  }

  // 监听配置变化
  watch(enabled, (newEnabled) => {
    if (newEnabled && shouldAutoScroll.value) {
      start()
    }
    else {
      stop()
    }
  })

  watch(speed, () => {
    // 速度变化时，如果正在自动滚动，重新开始以应用新速度
    if (state.isAutoScrolling) {
      stop()
      nextTick(() => {
        if (shouldAutoScroll.value) {
          start()
        }
      })
    }
  })

  // 清理函数
  onUnmounted(() => {
    stop()
    if (resumeTimeoutId) {
      clearTimeout(resumeTimeoutId)
    }
  })

  return {
    state: readonly(state),
    start,
    stop,
    toggle,
    pauseByHover,
    resumeByHover,
    handleManualScroll,
  }
}

/**
 * 为元素添加自动阅读鼠标事件监听器
 * @param element 目标元素
 * @param autoRead 自动阅读实例
 */
export function addAutoReadMouseEvents(
  element: HTMLElement,
  autoRead: ReturnType<typeof useAutoRead>,
) {
  const handleMouseEnter = () => autoRead.pauseByHover()
  const handleMouseLeave = () => autoRead.resumeByHover()

  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)

  // 返回清理函数
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * 为滚动容器添加手动滚动监听器
 * @param container 滚动容器
 * @param autoRead 自动阅读实例
 */
export function addAutoReadScrollListener(
  container: HTMLElement,
  autoRead: ReturnType<typeof useAutoRead>,
) {
  const handleScroll = () => autoRead.handleManualScroll()

  container.addEventListener('scroll', handleScroll, { passive: true })

  // 返回清理函数
  return () => {
    container.removeEventListener('scroll', handleScroll)
  }
}
