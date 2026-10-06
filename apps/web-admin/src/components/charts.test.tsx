import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BarChart, DonutChart, LineChart, TrendChart } from './charts'

describe('dashboard charts', () => {
  it('renders an accessible line chart with a rendered series', () => {
    const { container } = render(<LineChart data={[10, 20, 15]} label="Traffic trend" />)

    expect(screen.getByRole('img', { name: 'Traffic trend' })).toBeTruthy()
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('renders channel values without mutating the input', () => {
    const data = [
      { name: 'Direct', value: 65 },
      { name: 'Search', value: 35 },
    ]
    render(<DonutChart items={data} />)

    expect(screen.getByText('65%')).toBeTruthy()
    expect(data).toEqual([
      { name: 'Direct', value: 65 },
      { name: 'Search', value: 35 },
    ])
  })

  it('handles empty, flat, and single-point line series', () => {
    const { rerender } = render(<LineChart data={[]} label="Empty trend" />)
    expect(screen.getByRole('img', { name: 'Empty trend' })).toBeTruthy()

    rerender(<LineChart data={[5]} label="Single trend" />)
    expect(screen.getByRole('img', { name: 'Single trend' })).toBeTruthy()

    rerender(<LineChart data={[5, 5]} label="Flat trend" />)
    expect(screen.getByRole('img', { name: 'Flat trend' })).toBeTruthy()
  })

  it('uses the fallback palette for additional donut segments', () => {
    const { container } = render(
      <DonutChart
        items={[
          { name: 'One', value: 20 },
          { name: 'Two', value: 20 },
          { name: 'Three', value: 20 },
          { name: 'Four', value: 20 },
          { name: 'Five', value: 20 },
        ]}
      />,
    )

    expect(screen.getByText('Five')).toBeTruthy()
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(5)
  })

  it('renders multiple trend series with a compact long axis and a legend', () => {
    const labels = Array.from({ length: 14 }, (_, index) => `${index}:00`)
    const { container } = render(
      <TrendChart
        label="Hourly activity"
        labels={labels}
        series={[
          { color: '#1677ff', data: labels.map((_, index) => index * 10), name: 'Visits' },
          { color: '#52c41a', data: labels.map((_, index) => index * 4), name: 'Engaged' },
        ]}
      />,
    )

    expect(screen.getByRole('img', { name: 'Hourly activity' })).toBeTruthy()
    expect(screen.getByText('Visits')).toBeTruthy()
    expect(screen.getByText('13:00')).toBeTruthy()
    expect(container.querySelectorAll('linearGradient').length).toBe(2)
  })

  it('falls back to generated labels when a series is longer than the axis', () => {
    render(
      <TrendChart
        label="Short axis"
        labels={['Only']}
        series={[{ color: '#722ed1', data: [1, 2, 3], name: 'Overflow' }]}
      />,
    )

    expect(screen.getByRole('img', { name: 'Short axis' })).toBeTruthy()
    expect(screen.getByText('3')).toBeTruthy()
  })

  it('renders column data and empty distributions safely', () => {
    const { rerender } = render(
      <BarChart data={[10, 30]} label="Monthly visits" labels={['Jan', 'Feb']} />,
    )
    expect(screen.getByRole('img', { name: 'Monthly visits' })).toBeTruthy()
    expect(screen.getByText('Feb')).toBeTruthy()

    rerender(<BarChart color="#eb2f96" data={[12]} label="Accent visits" labels={['Mar']} />)
    expect(screen.getByRole('img', { name: 'Accent visits' })).toBeTruthy()

    rerender(<BarChart data={[]} label="No visits" labels={[]} />)
    expect(screen.getByRole('img', { name: 'No visits' })).toBeTruthy()

    rerender(<DonutChart centerLabel="Empty" items={[{ name: 'None', value: 0 }]} />)
    expect(screen.getAllByText('0%')).toHaveLength(2)
    expect(screen.getByRole('img', { name: 'Empty分布' })).toBeTruthy()

    rerender(<DonutChart centerLabel="Nothing" items={[]} />)
    expect(screen.getByRole('img', { name: 'Nothing分布' })).toBeTruthy()
    expect(screen.getByText('0%')).toBeTruthy()
  })

  it('ignores negative donut values when computing the distribution', () => {
    render(
      <DonutChart
        items={[
          { name: 'Positive', value: 75 },
          { name: 'Negative', value: -25 },
        ]}
      />,
    )

    expect(screen.getByText('Positive')).toBeTruthy()
    expect(screen.getAllByText('100%')).toHaveLength(2)
    expect(screen.getByText('0%')).toBeTruthy()
  })
})
