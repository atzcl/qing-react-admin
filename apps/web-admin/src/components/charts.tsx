import { areaY, barY, colorLegend, defineChart, lineY } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { Chart } from '@tanstack/charts/react'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'
import { theme } from 'antd'
import { useId } from 'react'

type AntdToken = ReturnType<typeof theme.useToken>['token']

type ColorTokenKey =
  | 'colorError'
  | 'colorInfo'
  | 'colorPrimary'
  | 'colorSuccess'
  | 'colorTextTertiary'
  | 'colorWarning'

const colorTokenByVariable: Readonly<Record<string, ColorTokenKey>> = {
  'var(--ant-color-error)': 'colorError',
  'var(--ant-color-info)': 'colorInfo',
  'var(--ant-color-primary)': 'colorPrimary',
  'var(--ant-color-success)': 'colorSuccess',
  'var(--ant-color-text-tertiary)': 'colorTextTertiary',
  'var(--ant-color-warning)': 'colorWarning',
}

/**
 * TanStack Charts paints SVG presentation attributes, where `var()` cannot be
 * resolved. Map the application's semantic CSS variables to concrete Ant Design
 * theme tokens so charts follow light and dark themes.
 */
function resolveColor(color: string, token: AntdToken): string {
  const tokenKey = colorTokenByVariable[color]
  return tokenKey ? token[tokenKey] : color
}

function useChartTheme() {
  const { token } = theme.useToken()
  return {
    token,
    chartTheme: {
      background: 'transparent',
      foreground: token.colorTextSecondary,
      grid: token.colorBorderSecondary,
      muted: token.colorTextTertiary,
      palette: [
        token.colorPrimary,
        token.colorSuccess,
        token.colorWarning,
        token.colorInfo,
        token.colorTextTertiary,
      ],
    },
  }
}

function visibleAxisLabels(labels: string[]): string[] {
  if (labels.length <= 12) return labels
  return labels.filter((_, index) => index === labels.length - 1 || index % 3 === 0)
}

/** Keep the axis order stable while still covering labels beyond the supplied axis. */
function axisDomain(labels: string[], rows: ReadonlyArray<{ label: string }>): string[] {
  if (rows.length === 0) return labels
  const seen = new Set<string>()
  const domain: string[] = []
  for (const row of rows) {
    if (seen.has(row.label)) continue
    seen.add(row.label)
    domain.push(row.label)
  }
  return domain
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

interface TrendRow {
  label: string
  series: string
  value: number
}

function buildTrendRows(labels: string[], series: TrendSeries[]): TrendRow[] {
  const rows: TrendRow[] = []
  for (const item of series) {
    item.data.forEach((value, index) => {
      rows.push({ label: labels[index] ?? String(index + 1), series: item.name, value })
    })
  }
  return rows
}

export function TrendChart({ label, labels, series }: TrendChartProps) {
  const { token, chartTheme } = useChartTheme()
  const gradientPrefix = useId().replaceAll(':', '')
  const rows = buildTrendRows(labels, series)
  const domain = axisDomain(labels, rows)
  const colors = series.map((item) => resolveColor(item.color, token))
  const gradientIds = new Map(
    series.map((item, index) => [item.name, `${gradientPrefix}-trend-${index}`]),
  )

  const definition = defineChart({
    marks: [
      areaY(rows, {
        fill: (row) => `url(#${gradientIds.get(row.series) ?? ''})`,
        x: 'label',
        y: 'value',
        z: 'series',
      }),
      lineY(rows, {
        points: true,
        strokeWidth: 2.25,
        x: 'label',
        y: 'value',
        z: 'series',
      }),
    ],
    scales: {
      x: {
        axis: {
          line: false,
          tickLabels: { fontSize: 11 },
          ticks: { size: 0, values: visibleAxisLabels(domain) },
        },
        scale: () => scalePoint().domain(domain),
      },
      y: { axis: false, grid: true, nice: true, scale: scaleLinear },
    },
    color: {
      domain: series.map((item) => item.name),
      legend: colorLegend({ placement: 'top' }),
      range: colors,
    },
    gradients: series.map((item, index) => ({
      id: gradientIds.get(item.name) ?? `${gradientPrefix}-trend-${index}`,
      stops: [
        { color: colors[index] ?? token.colorPrimary, offset: 0, opacity: 0.22 },
        { color: colors[index] ?? token.colorPrimary, offset: 1, opacity: 0 },
      ],
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 1,
    })),
    theme: chartTheme,
    tooltip,
  })

  return <Chart ariaLabel={label} className="analytics-chart trend-chart" definition={definition} />
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
  const { token, chartTheme } = useChartTheme()
  const rows = data.map((value, index) => ({
    label: labels[index] ?? String(index + 1),
    value,
  }))
  const domain = axisDomain(labels, rows)

  const definition = defineChart({
    marks: [
      barY(rows, {
        fill: resolveColor(color, token),
        maxThickness: 52,
        radius: { end: 5 },
        x: 'label',
        y: 'value',
      }),
    ],
    scales: {
      x: {
        axis: {
          line: false,
          tickLabels: { fontSize: 11 },
          ticks: { size: 0, values: visibleAxisLabels(domain) },
        },
        scale: () => scaleBand().domain(domain).paddingInner(0.44),
      },
      y: { axis: false, grid: true, nice: true, scale: scaleLinear },
    },
    theme: chartTheme,
    tooltip,
  })

  return <Chart ariaLabel={label} className="analytics-chart bar-chart" definition={definition} />
}

interface DonutChartProps {
  centerLabel?: string
  items: Array<{ name: string; value: number }>
}

export function DonutChart({ centerLabel = '访问来源', items }: DonutChartProps) {
  const { token, chartTheme } = useChartTheme()
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0)
  const colors = items.map(
    (_, index) =>
      [token.colorPrimary, token.colorSuccess, token.colorWarning, token.colorInfo][index] ??
      token.colorTextTertiary,
  )
  const segments = items.map((item, index) => ({
    color: colors[index] ?? token.colorTextTertiary,
    item,
    value: total === 0 ? 0 : (Math.max(0, item.value) / total) * 100,
  }))
  const slices = pie(
    items.map((item) => ({ name: item.name, value: Math.max(0, item.value) })),
    { value: 'value' },
  )

  const definition = defineChart({
    marks: [
      polar({
        inset: 6,
        marks: [
          radialArc(slices, {
            color: 'name',
            cornerRadius: 3,
            innerRadius: ({ radius }) => radius * 0.58,
            key: 'name',
          }),
        ],
        radiusRatio: 0.9,
        scales: { angle: null, radius: null },
      }),
    ],
    scales: { x: null, y: null },
    color: {
      domain: items.map((item) => item.name),
      range: colors,
    },
    theme: chartTheme,
    tooltip,
  })

  return (
    <div className="donut-chart-wrap">
      <div className="donut-chart">
        <Chart
          ariaLabel={`${centerLabel}分布`}
          className="analytics-chart"
          definition={definition}
          height={128}
          width={128}
        />
        <div className="donut-chart__label">
          <strong>{total > 0 ? '100%' : '0%'}</strong>
          <span>{centerLabel}</span>
        </div>
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
