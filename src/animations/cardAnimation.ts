import gsap from 'gsap'

/**
 * 卡片动画配置选项
 */
export interface CardAnimationOptions {
  /** 动画方向 */
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'
  /** 动画持续时间（秒） */
  duration?: number
  /** 行延迟时间（秒） */
  rowDelay?: number
  /** 列延迟时间（秒） */
  colDelay?: number
  /** 缓动函数 */
  ease?: string
  /** 初始缩放值 */
  initialScale?: number
  /** 初始旋转角度 */
  initialRotation?: number
  /** 初始位移距离（像素） */
  initialOffset?: number
  /** 变换原点 */
  transformOrigin?: string
  /** 每个项目的宽度（像素），用于计算网格位置 */
  itemWidth?: number
}

/**
 * 动画钩子函数类型
 */
export interface AnimationHooks {
  onBeforeEnter: (el: Element) => void
  onEnter: (el: Element, done: () => void) => void
  onLeave: (el: Element, done: () => void) => void
  onMove: (el: Element, done: () => void) => void
}

/**
 * 计算网格中的行和列
 * @param index 元素索引
 * @param itemWidth 每个项目的宽度（像素）
 * @returns 行、列和每行项目数
 */
export const calculateGridPosition = (index: number, itemWidth: number = 240) => {
  // 估计每行显示的卡片数量，根据窗口宽度动态计算
  const itemsPerRow = Math.floor(window.innerWidth / itemWidth) || 4
  const row = Math.floor(index / itemsPerRow)
  const col = index % itemsPerRow
  return { row, col, itemsPerRow }
}

/**
 * 创建卡片动画
 * @param options 动画配置选项
 * @returns 动画钩子函数
 */
export const createCardAnimation = (options: CardAnimationOptions = {}): AnimationHooks => {
  // 默认配置
  const config = {
    direction: 'left-to-right',
    duration: 0.4,
    rowDelay: 0.06,
    colDelay: 0.05,
    ease: 'back.out(1.1)',
    initialScale: 0.8,
    initialRotation: -2,
    initialOffset: 30,
    transformOrigin: 'center bottom',
    itemWidth: 240,
    ...options,
  }

  // 根据方向设置初始状态
  const getInitialProps = () => {
    switch (config.direction) {
      case 'right-to-left':
        return { x: config.initialOffset, y: 0 }
      case 'top-to-bottom':
        return { x: 0, y: -config.initialOffset }
      case 'bottom-to-top':
        return { x: 0, y: config.initialOffset }
      case 'left-to-right':
      default:
        return { x: -config.initialOffset, y: 0 }
    }
  }

  // 元素进入前的初始状态
  const onBeforeEnter = (el: Element) => {
    const { x, y } = getInitialProps()
    gsap.set(el, {
      opacity: 0,
      scale: config.initialScale,
      x,
      y,
      rotateZ: config.initialRotation,
      transformOrigin: config.transformOrigin,
    })
  }

  // 元素进入时的动画
  const onEnter = (el: Element, done: () => void) => {
    // 获取元素在父容器中的索引
    const index = Array.from(el.parentElement?.children || []).indexOf(el)

    // 计算行和列位置
    const { row, col } = calculateGridPosition(index, config.itemWidth)

    // 计算延迟，使卡片依次浮现
    let delay: number

    if (config.direction === 'right-to-left') {
      // 从右到左，先显示右侧的卡片
      const { itemsPerRow } = calculateGridPosition(index, config.itemWidth)
      const reversedCol = itemsPerRow - col - 1
      delay = row * config.rowDelay + reversedCol * config.colDelay
    } else {
      // 默认从左到右
      delay = row * config.rowDelay + col * config.colDelay
    }

    // 执行动画
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotateZ: 0,
      duration: config.duration,
      delay: delay,
      ease: config.ease,
      onComplete: done,
    })
  }

  // 元素离开时的动画
  const onLeave = (el: Element, done: () => void) => {
    // 获取元素在父容器中的索引
    const index = Array.from(el.parentElement?.children || []).indexOf(el)

    // 计算行和列位置
    const { col } = calculateGridPosition(index, config.itemWidth)

    // 设置离开动画
    const { x, y } = getInitialProps()

    gsap.to(el, {
      opacity: 0,
      scale: config.initialScale,
      x: x / 2, // 使离开动画的位移更小
      y: y / 2,
      rotateZ: config.initialRotation / 2,
      duration: config.duration * 0.75, // 离开动画稍快
      delay: col * (config.colDelay / 2), // 离开动画的延迟更短
      ease: 'power1.in',
      onComplete: done,
    })
  }

  // 元素移动时的动画
  const onMove = (el: Element, done: () => void) => {
    gsap.to(el, {
      duration: config.duration * 0.75,
      ease: 'power1.out',
      onComplete: done,
    })
  }

  return {
    onBeforeEnter,
    onEnter,
    onLeave,
    onMove,
  }
}

/**
 * 预设动画效果
 */
export const cardAnimations = {
  // 从左到右浮现
  leftToRight: createCardAnimation({
    direction: 'left-to-right',
    initialOffset: 30,
  }),

  // 从右到左浮现
  rightToLeft: createCardAnimation({
    direction: 'right-to-left',
    initialOffset: 30,
  }),

  // 从上到下浮现
  topToBottom: createCardAnimation({
    direction: 'top-to-bottom',
    initialOffset: 40,
    initialRotation: -1,
  }),

  // 从下到上浮现
  bottomToTop: createCardAnimation({
    direction: 'bottom-to-top',
    initialOffset: 40,
    initialRotation: 1,
    transformOrigin: 'center top',
  }),

  // 缓慢浮现（无位移）
  fade: createCardAnimation({
    initialOffset: 0,
    initialScale: 0.9,
    initialRotation: 0,
    duration: 0.6,
    rowDelay: 0.08,
    colDelay: 0.08,
    ease: 'power2.out',
  }),

  // 弹性浮现
  bounce: createCardAnimation({
    initialOffset: 0,
    initialScale: 0.7,
    initialRotation: 0,
    duration: 0.8,
    rowDelay: 0.1,
    colDelay: 0.05,
    ease: 'elastic.out(1, 0.5)',
  }),
}

/**
 * 应用卡片动画样式
 * @param selector CSS选择器或元素
 * @param options 样式选项
 */
export const applyCardStyles = (
  selector: string | HTMLElement,
  options: {
    gridColumns?: string
    gridGap?: string
    itemHoverTransform?: string
  } = {},
) => {
  const defaultOptions = {
    gridColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gridGap: '20px',
    itemHoverTransform: 'translateY(-8px) scale(1.02)',
  }

  const config = { ...defaultOptions, ...options }

  // 获取元素
  const container = typeof selector === 'string' ? document.querySelector(selector) : selector

  if (!container) return

  // 应用网格容器样式
  if (container instanceof HTMLElement) {
    Object.assign(container.style, {
      display: 'grid',
      gridTemplateColumns: config.gridColumns,
      gap: config.gridGap,
      justifyContent: 'center',
      perspective: '1200px',
      transformStyle: 'preserve-3d',
      overflow: 'visible',
      width: '100%',
    })

    // 应用卡片项样式
    const items = container.children
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement
      Object.assign(item.style, {
        willChange: 'transform, opacity',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transformOrigin: 'center bottom',
        backfaceVisibility: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        position: 'relative',
      })

      // 添加悬停效果
      item.addEventListener('mouseenter', () => {
        item.style.transform = config.itemHoverTransform
        item.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.1)'
        item.style.zIndex = '2'
      })

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'none'
        item.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)'
        item.style.zIndex = 'auto'
      })
    }
  }
}

// 默认导出所有动画
export default {
  createCardAnimation,
  cardAnimations,
  applyCardStyles,
}
