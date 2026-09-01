import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

/** Opt-in diagnostics keep development chrome out of product screenshots and daily use. */
export function DevelopmentTools() {
  return (
    <>
      <TanStackRouterDevtools
        position="bottom-right"
        toggleButtonProps={{ style: { bottom: '80px', right: '12px' } }}
      />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  )
}
