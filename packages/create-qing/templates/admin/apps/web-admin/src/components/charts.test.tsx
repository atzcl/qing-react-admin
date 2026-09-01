import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BarChart, DonutChart, LineChart, TrendChart } from './charts'

describe('dashboard charts', () => {
  it('renders an accessible line chart', () => {
    render(<LineChart data={[10, 20, 15]} label="Traffic trend" />)
    expect(screen.getByRole('img', { name: 'Traffic trend' })).toBeTruthy()
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
    render(
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
  })

  it('renders multiple trend series with a compact long axis', () => {
    const labels = Array.from({ length: 14 }, (_, index) => `${index}:00`)
    render(
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
  })

  it('renders column data and empty distributions safely', () => {
    const { rerender } = render(
      <BarChart data={[10, 30]} label="Monthly visits" labels={['Jan', 'Feb']} />,
    )
    expect(screen.getByRole('img', { name: 'Monthly visits' })).toBeTruthy()
    expect(screen.getByText('Feb')).toBeTruthy()

    rerender(<BarChart data={[]} label="No visits" labels={[]} />)
    expect(screen.getByRole('img', { name: 'No visits' })).toBeTruthy()

    rerender(<DonutChart centerLabel="Empty" items={[{ name: 'None', value: 0 }]} />)
    expect(screen.getAllByText('0%')).toHaveLength(2)
    expect(screen.getByRole('img', { name: 'Empty分布' })).toBeTruthy()
  })
})
