/**
 * 图片工具类
 * 用于处理图片相关的操作，包括判断图片是否为纯色等
 */

/**
 * 颜色信息接口
 */
export interface ColorInfo {
  /** 红色分量 (0-255) */
  r: number
  /** 绿色分量 (0-255) */
  g: number
  /** 蓝色分量 (0-255) */
  b: number
  /** 透明度分量 (0-255) */
  a: number
}

/**
 * 纯色检测结果接口
 */
export interface SolidColorResult {
  /** 是否为纯色图片 */
  isSolid: boolean
  /** 主要颜色信息（如果是纯色） */
  color?: ColorInfo
  /** 颜色的十六进制表示 */
  hex?: string
  /** 检测的像素总数 */
  totalPixels: number
  /** 相同颜色的像素数量 */
  sameColorPixels: number
  /** 相似度百分比 */
  similarity: number
}

/**
 * 检测配置选项
 */
export interface DetectionOptions {
  /** 颜色容差，用于判断颜色是否相似 (0-255，默认为5) */
  tolerance?: number
  /** 采样率，用于提高检测速度 (1-10，默认为1，表示检测所有像素) */
  sampleRate?: number
  /** 相似度阈值，超过此值认为是纯色 (0-1，默认为0.95) */
  threshold?: number
}

/**
 * 将图片URL转换为Canvas元素
 * @param imageUrl 图片URL或base64字符串
 * @returns Promise<HTMLCanvasElement>
 */
export function loadImageToCanvas(imageUrl: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // 处理跨域问题

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('无法获取Canvas上下文'))
        return
      }

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      resolve(canvas)
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    img.src = imageUrl
  })
}

/**
 * 将File对象转换为Canvas元素
 * @param file 图片文件
 * @returns Promise<HTMLCanvasElement>
 */
export function loadFileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('文件不是图片格式'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      loadImageToCanvas(imageUrl).then(resolve).catch(reject)
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 计算两个颜色之间的差异
 * @param color1 颜色1
 * @param color2 颜色2
 * @returns 颜色差异值 (0-441.67)
 */
function getColorDifference(color1: ColorInfo, color2: ColorInfo): number {
  const rDiff = color1.r - color2.r
  const gDiff = color1.g - color2.g
  const bDiff = color1.b - color2.b
  const aDiff = color1.a - color2.a

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff + aDiff * aDiff)
}

/**
 * 将颜色信息转换为十六进制字符串
 * @param color 颜色信息
 * @returns 十六进制颜色字符串
 */
function colorToHex(color: ColorInfo): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}${color.a < 255 ? toHex(color.a) : ''}`
}

/**
 * 检测图片是否为纯色
 * @param canvas Canvas元素
 * @param options 检测选项
 * @returns 检测结果
 */
export function detectSolidColor(
  canvas: HTMLCanvasElement,
  options: DetectionOptions = {},
): SolidColorResult {
  const { tolerance = 5, sampleRate = 1, threshold = 0.95 } = options

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('无法获取Canvas上下文')
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const totalPixels = canvas.width * canvas.height

  // 获取第一个像素的颜色作为基准
  const baseColor: ColorInfo = {
    r: data[0],
    g: data[1],
    b: data[2],
    a: data[3],
  }

  let sameColorPixels = 0
  let checkedPixels = 0

  // 按采样率检测像素
  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const currentColor: ColorInfo = {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3],
    }

    const difference = getColorDifference(baseColor, currentColor)

    if (difference <= tolerance) {
      sameColorPixels++
    }

    checkedPixels++
  }

  const similarity = sameColorPixels / checkedPixels
  const isSolid = similarity >= threshold

  return {
    isSolid,
    color: isSolid ? baseColor : undefined,
    hex: isSolid ? colorToHex(baseColor) : undefined,
    totalPixels,
    sameColorPixels: Math.round(sameColorPixels * sampleRate),
    similarity,
  }
}

/**
 * 检测图片URL是否为纯色
 * @param imageUrl 图片URL
 * @param options 检测选项
 * @returns Promise<检测结果>
 */
export async function isSolidColorImage(
  imageUrl: string,
  options?: DetectionOptions,
): Promise<SolidColorResult> {
  const canvas = await loadImageToCanvas(imageUrl)
  return detectSolidColor(canvas, options)
}

/**
 * 检测图片文件是否为纯色
 * @param file 图片文件
 * @param options 检测选项
 * @returns Promise<检测结果>
 */
export async function isSolidColorFile(
  file: File,
  options?: DetectionOptions,
): Promise<SolidColorResult> {
  const canvas = await loadFileToCanvas(file)
  return detectSolidColor(canvas, options)
}

/**
 * 批量检测多个图片是否为纯色
 * @param images 图片URL数组或File数组
 * @param options 检测选项
 * @returns Promise<检测结果数组>
 */
export async function batchDetectSolidColor(
  images: (string | File)[],
  options?: DetectionOptions,
): Promise<SolidColorResult[]> {
  const results: SolidColorResult[] = []

  for (const image of images) {
    try {
      let result: SolidColorResult
      if (typeof image === 'string') {
        result = await isSolidColorImage(image, options)
      } else {
        result = await isSolidColorFile(image, options)
      }
      results.push(result)
    } catch (error) {
      console.error('检测图片失败:', error)
      results.push({
        isSolid: false,
        totalPixels: 0,
        sameColorPixels: 0,
        similarity: 0,
      })
    }
  }

  return results
}
