import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Badge, Card, Statistic, Tabs } from 'antd'

import { BarChart, DonutChart, TrendChart } from '~/components/charts'

import { analyticsQueryOptions } from './queries'

const numberFormatter = new Intl.NumberFormat('zh-CN')
const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Shanghai',
})

const metricPresentation = [
  { icon: TeamOutlined, tone: 'blue' },
  { icon: EyeOutlined, tone: 'cyan' },
  { icon: DownloadOutlined, tone: 'violet' },
  { icon: ThunderboltOutlined, tone: 'amber' },
] as const

export default function AnalyticsPage() {
  const { data, dataUpdatedAt, isFetching } = useSuspenseQuery(analyticsQueryOptions)
  const maximumServiceValue = Math.max(1, ...data.services.map((item) => item.value))

  return (
    <main className="page analytics-page">
      <header className="analytics-overview-header">
        <div>
          <Badge status={isFetching ? 'processing' : 'success'} text="实时概览" />
          <h1>运营数据</h1>
          <p>聚焦访问、活跃与渠道效率，快速识别今天的业务变化。</p>
        </div>
        <div className="analytics-overview-header__updated">
          <ClockCircleOutlined />
          <span>
            <strong>{timeFormatter.format(dataUpdatedAt)}</strong>
            <small>每 60 秒刷新</small>
          </span>
        </div>
      </header>

      <section aria-label="核心指标" className="metric-grid">
        {data.metrics.map((metric, index) => {
          const presentation = metricPresentation[index] ?? metricPresentation[0]
          const Icon = presentation.icon
          const positive = metric.change >= 0
          return (
            <Card className="metric-card" key={metric.label} variant="borderless">
              <div className="metric-card__header">
                <span>{metric.label}</span>
                <span className={`metric-icon is-${presentation.tone}`}>
                  <Icon />
                </span>
              </div>
              <Statistic value={metric.value} />
              <div className="metric-card__footer">
                <span
                  aria-label={`较昨日${positive ? '增长' : '下降'} ${Math.abs(metric.change)}%`}
                  className={positive ? 'metric-change is-positive' : 'metric-change is-negative'}
                >
                  {positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(metric.change)}%
                </span>
                <span>较昨日</span>
                <span className="metric-total">累计 {numberFormatter.format(metric.total)}</span>
              </div>
            </Card>
          )
        })}
      </section>

      <Card
        className="chart-card chart-card--wide"
        title={
          <span className="chart-card__title">
            访问趋势
            <small>今日 06:00–23:00</small>
          </span>
        }
        variant="borderless"
      >
        <Tabs
          items={[
            {
              children: (
                <TrendChart
                  label="今日访问与深度互动趋势"
                  labels={data.hourly.labels}
                  series={[
                    {
                      color: 'var(--ant-color-primary)',
                      data: data.hourly.visits,
                      name: '访问量',
                    },
                    {
                      color: 'var(--ant-color-success)',
                      data: data.hourly.engaged,
                      name: '深度互动',
                    },
                  ]}
                />
              ),
              key: 'trends',
              label: '分时趋势',
            },
            {
              children: (
                <BarChart
                  data={data.monthly.visits}
                  label="月度访问量"
                  labels={data.monthly.labels}
                />
              ),
              key: 'visits',
              label: '月度对比',
            },
          ]}
        />
      </Card>

      <section className="analytics-bottom-grid">
        <Card className="chart-card" title="终端分布" variant="borderless">
          <ul className="distribution-list">
            {data.devices.map((item) => (
              <li key={item.name}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.value}%</small>
                </span>
                <i aria-hidden="true">
                  <b style={{ width: `${item.value}%` }} />
                </i>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="chart-card" title="访问来源" variant="borderless">
          <DonutChart items={data.channels} />
        </Card>
        <Card className="chart-card" title="服务收入" variant="borderless">
          <ol className="service-ranking">
            {data.services.map((item, index) => (
              <li key={item.name}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item.name}</strong>
                  <i aria-hidden="true">
                    <b style={{ width: `${(item.value / maximumServiceValue) * 100}%` }} />
                  </i>
                </div>
                <b>{numberFormatter.format(item.value)}</b>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </main>
  )
}
