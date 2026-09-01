/** Query payload owned by the analytics feature rather than the global shell. */
export interface AnalyticsSnapshot {
  channels: Array<{ name: string; value: number }>
  devices: Array<{ name: string; value: number }>
  hourly: {
    engaged: number[]
    labels: string[]
    visits: number[]
  }
  metrics: Array<{
    change: number
    label: string
    total: number
    value: number
  }>
  monthly: {
    labels: string[]
    visits: number[]
  }
  services: Array<{ name: string; value: number }>
}

const analyticsSnapshot: AnalyticsSnapshot = {
  channels: [
    { name: '搜索引擎', value: 42 },
    { name: '直接访问', value: 28 },
    { name: '社交媒体', value: 18 },
    { name: '外部链接', value: 12 },
  ],
  devices: [
    { name: '网页端', value: 46 },
    { name: '移动端', value: 31 },
    { name: '桌面客户端', value: 15 },
    { name: '其他', value: 8 },
  ],
  hourly: {
    engaged: [
      33, 66, 88, 333, 3333, 6200, 20_000, 3000, 1200, 13_000, 22_000, 11_000, 2221, 1201, 390, 198,
      60, 30,
    ],
    labels: Array.from({ length: 18 }, (_, index) => `${index + 6}:00`),
    visits: [
      111, 2000, 6000, 16_000, 33_333, 55_555, 64_000, 33_333, 18_000, 36_000, 70_000, 42_444,
      23_222, 13_000, 8000, 4000, 1200, 333,
    ],
  },
  metrics: [
    { change: 12.5, label: '用户量', total: 120_000, value: 2_000 },
    { change: 8.2, label: '访问量', total: 500_000, value: 20_000 },
    { change: -2.4, label: '下载量', total: 120_000, value: 8_000 },
    { change: 16.8, label: '使用量', total: 50_000, value: 5_000 },
  ],
  monthly: {
    labels: Array.from({ length: 12 }, (_, index) => `${index + 1}月`),
    visits: [3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000, 4800],
  },
  services: [
    { name: '交付外包', value: 500 },
    { name: '远程协作', value: 400 },
    { name: '产品定制', value: 310 },
    { name: '技术支持', value: 274 },
  ],
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  return analyticsSnapshot
}
