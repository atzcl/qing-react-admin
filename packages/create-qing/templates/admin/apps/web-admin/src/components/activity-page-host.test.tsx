import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { App } from 'antd'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { AppStoreProvider } from '~/core/app-store'
import { getAdminPage } from '~/core/page-registry'

import { ActivityPageHost } from './activity-page-host'

const queryClient = new QueryClient()
queryClient.setQueryData(['dashboard', 'analytics'], {
  channels: [],
  devices: [],
  hourly: { engaged: [], labels: [], visits: [] },
  metrics: [],
  monthly: { labels: [], visits: [] },
  services: [],
})

function RetainedTestPage() {
  const [value, setValue] = useState('')
  return (
    <input
      aria-label="retained value"
      onChange={(event) => setValue(event.target.value)}
      value={value}
    />
  )
}

function Host({ pathname }: { pathname: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <App>
        <AppStoreProvider>
          <ActivityPageHost
            href={pathname}
            definitionPath={pathname}
            params={{}}
            pathname={pathname}
          />
        </AppStoreProvider>
      </App>
    </QueryClientProvider>
  )
}

describe('ActivityPageHost', () => {
  it('retains local page state across tab switches', async () => {
    window.localStorage.clear()
    const tabsPage = getAdminPage('/demos/features/tabs')
    expect(tabsPage).toBeDefined()
    const originalPage = tabsPage!.page
    tabsPage!.page = RetainedTestPage
    const view = render(<Host pathname="/demos/features/tabs" />)
    const input = await screen.findByRole('textbox', { name: 'retained value' })
    const pageInput = () =>
      view.container.querySelector<HTMLInputElement>(
        '[data-page-path="/demos/features/tabs"] input[aria-label="retained value"]',
      )
    fireEvent.change(input, { target: { value: 'Activity retained value' } })
    expect(pageInput()?.value).toBe('Activity retained value')

    view.rerender(<Host pathname="/dashboard/workspace" />)
    await screen.findByText('项目', { selector: '.ant-card-head-title' })
    view.rerender(<Host pathname="/demos/features/tabs" />)
    expect(pageInput()?.value).toBe('Activity retained value')
    tabsPage!.page = originalPage
  })
})
