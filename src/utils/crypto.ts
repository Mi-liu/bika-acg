import type { MethodType } from 'alova'
/**
 * 加密工具类
 * 使用 crypto-js 实现加密和解密功能
 */
import CryptoJS from 'crypto-js'

/** 密钥 */
export const DEFAULT_KEY = 'Please don\'t hack the api, thanks'

const appleKillFlag = getAppleKillFlag()
const appleVerSion = getAppleVersion()

/**
 * 获取当前时间戳 / 1000
 */
export function getTimeOnece() {
  return (new Date().getTime() / 1000).toFixed(0)
}
/**
 * 生成随机字符串
 */
export function randomString(e: number = 32) {
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}
/**
 * 随机字符串 并转成小写
 */
export function getNonce() {
  // 	useronce = randomString(32).toLowerCase();
  // const useronce = randomString(32).toLowerCase()
  // return useronce
  return 'gcgm5z3szpykjjxiihaxyahfjbt7w2mp'
}

function deRabbit(dataText: string): string {
  return CryptoJS.TripleDES.decrypt(dataText, DEFAULT_KEY).toString(CryptoJS.enc.Utf8)
}

function getAppleVersion() {
  return deRabbit(
    'U2FsdGVkX18QFwKERvHee/ffgOaC6ubPw+FwzpV6Evpm5ICFfhaxLim4SxhB+emgtRrHjvtOJs9tOuruZKdv2BPSEBw9ih7EfcVr2Srmoxc=',
  )
}

function getAppleKillFlag() {
  return deRabbit('U2FsdGVkX1/kZqW9m/2nul1sQl3H9FgxcBFF1fI6tzUtXz4NxMTK3cK3y2JSBrz6')
}

/**
 * 生成签名
 * @param { string } url 请求接口的路径
 * @param { string } ts getTimeOnece的返回值
 * @param { string } method 请求方式
 */
export function getsignature(url: string, ts: string, method: MethodType) {
  let raw = url + ts + getNonce() + method + appleKillFlag
  raw = raw.toLowerCase()
  return CryptoJS.HmacSHA256(raw, appleVerSion).toString(CryptoJS.enc.Hex)
}

/**
 * 生成请求头对象
 */
export function createHeader(pathname: string, method: MethodType) {
  const userStroe = useUserStoreHook()
  const settingStore = useSettingStoreHook()

  const setTime = getTimeOnece()
  const header = {
    'app-channel': 1,
    'app-uuid': 'webUUID',
    'Accept': 'application/vnd.picacomic.com.v1+json',
    'app-platform': 'android',
    'Content-Type': 'application/json; charset=UTF-8',
    'time': setTime,
    'nonce': getNonce(),
    'image-quality': settingStore.comic.imageQuality,
    'signature': getsignature(pathname, setTime, method),
    'authorization': userStroe.token,
  }
  return header
}
