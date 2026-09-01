import { createContext, useContext, useMemo } from 'react'
import type { PropsWithChildren } from 'react'

interface AdminPageContextValue {
  definitionPath: string
  params: Record<string, string>
  pathname: string
}

const AdminPageContext = createContext<AdminPageContextValue | null>(null)

interface AdminPageProviderProps extends PropsWithChildren {
  definitionPath: string
  params: Record<string, string>
  pathname: string
}

export function AdminPageProvider({
  children,
  definitionPath,
  params,
  pathname,
}: AdminPageProviderProps) {
  const value = useMemo(
    () => ({
      definitionPath,
      params,
      pathname,
    }),
    [definitionPath, params, pathname],
  )

  return <AdminPageContext value={value}>{children}</AdminPageContext>
}

export function useAdminPage() {
  const context = useContext(AdminPageContext)
  if (!context) throw new Error('useAdminPage must be used inside AdminPageProvider')
  return context
}
