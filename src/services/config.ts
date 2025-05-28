/** 代理配置 */
export const proxy = [
  {
    label: '线路一，无需VPN，速度略慢',
    value: {
      api: 'https://api.go2778.com/',
      file: 'https://s3.go2778.com/static/',
    },
  },
  {
    label: '线路二，需要VPN，速度较快',
    value: {
      api: 'https://api.manhuabika.com/',
      file: 'https://storage-b.picacomic.com/static/',
    },
  },
  {
    label: '线路三，需要VPN，速度较快',
    value: {
      api: 'https://picaapi.picacomic.com/',
      file: 'https://s3.picacomic.com/static/',
    },
  },
]
