import { useId } from 'react'

const chartWidth = 1000
const chartHeight = 280
const plotTop = 20
const plotBottom = 232

interface ChartPoint {
  x: number
  y: number
}

export interface TrendSeries {
  color: string
  data: number[]
  name: string
}

interface TrendChartProps {
  label: string
  labels: string[]
  series: TrendSeries[]
}

function pointsFor(data: number[], maximum: number): ChartPoint[] {
  if (data.length === 0) return []
  return data.map((value, index) => ({
    x: data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth,
    y: plotBottom - (Math.max(0, value) / maximum) * (plotBottom - plotTop),
  }))
}

function smoothPath(points: ChartPoint[]) {
  const first = points[0]
  if (!first) return ''
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index] ?? first
    const middleX = (previous.x + point.x) / 2
    return `${path} C ${middleX} ${previous.y}, ${middleX} ${point.y}, ${point.x} ${point.y}`
  }, `M ${first.x} ${first.y}`)
}

function visibleAxisLabels(labels: string[]) {
  if (labels.length <= 12) return labels.map((label, index) => ({ index, label }))
  return labels.flatMap((label, index) =>
    index === labels.length - 1 || index % 3 === 0 ? [{ index, label }] : [],
  )
}

export function TrendChart({ label, labels, series }: TrendChartProps) {
  const gradientPrefix = useId().replaceAll(':', '')
  const maximum = Math.max(1, ...series.flatMap((item) => item.data))
  const renderedSeries = series.map((item, index) => {
    const points = pointsFor(item.data, maximum)
    const path = smoothPath(points)
    const first = points[0]
    const last = points.at(-1)
    return {
      ...item,
      areaPath:
        first && last ? `${path} L ${last.x} ${plotBottom} L ${first.x} ${plotBottom} Z` : '',
      gradientId: `${gradientPrefix}-trend-${index}`,
      path,
      points,
    }
  })

  return (
    <figure aria-label={label} className="trend-chart analytics-chart" role="img">
      <ul aria-hidden="true" className="trend-chart__legend">
        {series.map((item) => (
          <li key={item.name}>
            <i style={{ backgroundColor: item.color }} />
            {item.name}
          </li>
        ))}
      </ul>
      <svg
        aria-hidden="true"
        preserveAspectRatio="none"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        <defs>
          {renderedSeries.map((item) => (
            <linearGradient id={item.gradientId} key={item.gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={item.color} stopOpacity="0.22" />
              <stop offset="1" stopColor={item.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0, 1, 2, 3, 4].map((index) => {
          const y = plotTop + ((plotBottom - plotTop) / 4) * index
          return (
            <line
              className="chart-gridline"
              key={index}
              vectorEffect="non-scaling-stroke"
              x1="0"
              x2={chartWidth}
              y1={y}
              y2={y}
            />
          )
        })}
        {renderedSeries.map((item) => (
          <g key={item.name}>
            {item.areaPath ? <path d={item.areaPath} fill={`url(#${item.gradientId})`} /> : null}
            {item.path ? (
              <path
                className="chart-line"
                d={item.path}
                fill="none"
                stroke={item.color}
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            {item.points.map((point, index) => (
              <circle
                className="chart-point"
                cx={point.x}
                cy={point.y}
                fill="var(--app-card)"
                key={`${point.x}-${point.y}`}
                r="3"
                stroke={item.color}
                vectorEffect="non-scaling-stroke"
              >
                <title>
                  {item.name} {labels[index] ?? index + 1}: {item.data[index]}
                </title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      <figcaption>
        {visibleAxisLabels(labels).map(({ index, label: axisLabel }) => (
          <span
            key={`${axisLabel}-${index}`}
            style={{ insetInlineStart: `${(index / Math.max(1, labels.length - 1)) * 100}%` }}
          >
            {axisLabel}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

interface BarChartProps {
  color?: string
  data: number[]
  label: string
  labels: string[]
}

export function BarChart({
  color = 'var(--ant-color-primary)',
  data,
  label,
  labels,
}: BarChartProps) {
  const maximum = Math.max(1, ...data)
  const slotWidth = chartWidth / Math.max(1, data.length)
  const barWidth = Math.min(52, slotWidth * 0.56)

  return (
    <figure aria-label={label} className="bar-chart analytics-chart" role="img">
      <svg
        aria-hidden="true"
        preserveAspectRatio="none"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        {[0, 1, 2, 3, 4].map((index) => {
          const y = plotTop + ((plotBottom - plotTop) / 4) * index
          return (
            <line
              className="chart-gridline"
              key={index}
              vectorEffect="non-scaling-stroke"
              x1="0"
              x2={chartWidth}
              y1={y}
              y2={y}
            />
          )
        })}
        {data.map((value, index) => {
          const height = (Math.max(0, value) / maximum) * (plotBottom - plotTop)
          const x = index * slotWidth + (slotWidth - barWidth) / 2
          return (
            <rect
              fill={color}
              height={height}
              key={`${labels[index] ?? index}-${value}`}
              rx="5"
              width={barWidth}
              x={x}
              y={plotBottom - height}
            >
              <title>
                {labels[index] ?? index + 1}: {value}
              </title>
            </rect>
          )
        })}
      </svg>
      <figcaption>
        {visibleAxisLabels(labels).map(({ index, label: axisLabel }) => (
          <span
            key={`${axisLabel}-${index}`}
            style={{ insetInlineStart: `${((index + 0.5) / Math.max(1, labels.length)) * 100}%` }}
          >
            {axisLabel}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

interface DonutChartProps {
  centerLabel?: string
  items: Array<{ name: string; value: number }>
}

export function DonutChart({ centerLabel = '访问来源', items }: DonutChartProps) {
  const colors = [
    'var(--ant-color-primary)',
    'var(--ant-color-success)',
    'var(--ant-color-warning)',
    'var(--ant-color-info)',
  ]
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0)
  const segments = items.map((item, index) => {
    const value = total === 0 ? 0 : (Math.max(0, item.value) / total) * 100
    return {
      color: colors[index] ?? 'var(--ant-color-text-tertiary)',
      item,
      start:
        total === 0
          ? 0
          : (items.slice(0, index).reduce((sum, current) => sum + Math.max(0, current.value), 0) /
              total) *
            100,
      value,
    }
  })

  return (
    <div className="donut-chart-wrap">
      <svg
        aria-label={`${centerLabel}分布`}
        className="donut-chart analytics-chart"
        role="img"
        viewBox="0 0 120 120"
      >
        <circle
          className="donut-track"
          cx="60"
          cy="60"
          fill="none"
          pathLength="100"
          r="42"
          strokeWidth="12"
        />
        {segments.map(({ color, item, start, value }) => (
          <circle
            cx="60"
            cy="60"
            fill="none"
            key={item.name}
            pathLength="100"
            r="42"
            stroke={color}
            strokeDasharray={`${value} ${100 - value}`}
            strokeDashoffset={-start}
            strokeLinecap="round"
            strokeWidth="12"
          />
        ))}
      </svg>
      <div className="donut-chart__label">
        <strong>{total > 0 ? '100%' : '0%'}</strong>
        <span>{centerLabel}</span>
      </div>
      <ul className="chart-legend">
        {segments.map(({ color, item, value }) => (
          <li key={item.name}>
            <i style={{ backgroundColor: color }} />
            <span>{item.name}</span>
            <strong>{Math.round(value)}%</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface LineChartProps {
  data: number[]
  label: string
}

/** Compact compatibility wrapper for smaller dashboard cards. */
export function LineChart({ data, label }: LineChartProps) {
  return (
    <TrendChart
      label={label}
      labels={data.map((_, index) => String(index + 1))}
      series={[{ color: 'var(--ant-color-primary)', data, name: label }]}
    />
  )
}
