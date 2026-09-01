import { Switch } from 'antd'
import type { ReactNode } from 'react'

export function PreferenceBlock({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="preference-section">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

export function SwitchRow({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="preference-switch-row">
      <span>{label}</span>
      <Switch
        checked={checked}
        {...(disabled === undefined ? {} : { disabled })}
        onChange={onChange}
        size="small"
      />
    </label>
  )
}
