import seniverseAlova from '@/services/seniverse'

/**
 * 实况天气响应数据结构
 */
interface WeatherNowResponse {
  results: {
    /** 城市信息 */
    location: {
      /** 城市ID */
      id: string
      /** 城市名称 */
      name: string
      /** 国家 */
      country: string
      /** 城市路径 */
      path: string
      /** 时区 */
      timezone: string
      /** 时区偏移 */
      timezone_offset: string
    }
    /** 当前天气信息 */
    now: {
      /** 天气描述 */
      text: string
      /** 天气代码 */
      code: string
      /** 当前温度 */
      temperature: string
    }
    /** 最后更新时间 */
    last_update: string
  }[]
}
/**
 * 根据ip获取城市实况
 */
// https://seniverse.yuque.com/hyper_data/api_v3/nyiu3t?
export function weatherNow() {
  return seniverseAlova
    .Get<WeatherNowResponse>('weather/now.json', {
      params: {
        location: 'ip',
      },
    })
    .then((res) => {
      return res.results[0]
    })
}
