import { Icon } from '@iconify/react'
import { Outlet } from '@tanstack/react-router'
import { Button, Tooltip } from 'antd'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'

import { LanguageToggle } from './language-toggle'

const themeColors = ['#006fe6', '#7c3aed', '#0284c7', '#059669', '#ea580c', '#e11d48']

function AppBrand() {
  return (
    <div className="auth-brand">
      <img alt="Qing React Admin" height={42} src="/favicon.svg" width={42} />
      <strong>Qing React Admin</strong>
    </div>
  )
}

export function AuthLayout() {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)

  return (
    <main className={`auth-layout is-${preferences.authPageLayout}`}>
      <div className="auth-logo-slot">
        <AppBrand />
      </div>
      <div className="auth-toolbar">
        <Tooltip title="切换主题色">
          <Button
            className="auth-toolbar__color"
            icon={<Icon icon="lucide:palette" />}
            onClick={() => {
              const index = themeColors.indexOf(preferences.colorPrimary)
              updatePreferences(appStore, {
                colorPrimary: themeColors[(index + 1) % themeColors.length]!,
              })
            }}
            type="text"
          />
        </Tooltip>
        <Tooltip title="切换登录布局">
          <Button
            icon={
              <Icon
                icon={
                  preferences.authPageLayout === 'panel-left'
                    ? 'lucide:panel-left'
                    : preferences.authPageLayout === 'panel-center'
                      ? 'lucide:panels-top-left'
                      : 'lucide:panel-right'
                }
              />
            }
            onClick={() => {
              const layouts = ['panel-right', 'panel-center', 'panel-left'] as const
              const index = layouts.indexOf(preferences.authPageLayout)
              updatePreferences(appStore, {
                authPageLayout: layouts[(index + 1) % layouts.length]!,
              })
            }}
            type="text"
          />
        </Tooltip>
        <LanguageToggle icon={<Icon icon="lucide:languages" />} />
        <Tooltip title="切换主题">
          <Button
            icon={<Icon icon={preferences.colorMode === 'dark' ? 'lucide:sun' : 'lucide:moon'} />}
            onClick={() =>
              updatePreferences(appStore, {
                colorMode: preferences.colorMode === 'dark' ? 'light' : 'dark',
              })
            }
            type="text"
          />
        </Tooltip>
      </div>
      <aside className="auth-showcase">
        <div aria-hidden="true" className="auth-showcase__ambient">
          <span className="auth-showcase__orb auth-showcase__orb--violet" />
          <span className="auth-showcase__orb auth-showcase__orb--blue" />
          <span className="auth-showcase__orb auth-showcase__orb--mint" />
          <span className="auth-showcase__grain" />
        </div>
        <div className="auth-showcase__content">
          <div className="auth-glass-scene">
            <section aria-label="工作台概览" className="auth-glass-window">
              <header className="auth-glass-window__bar">
                <span className="auth-glass-window__lights" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>Qing Workspace</span>
                <span className="auth-glass-window__status">
                  <i aria-hidden="true" /> 在线
                </span>
              </header>
              <div className="auth-glass-window__body">
                <div className="auth-glass-copy">
                  <span>今日工作台</span>
                  <strong>清晰掌握每一步进展。</strong>
                  <p>权限、数据与协作，在一个轻盈的界面里自然流动。</p>
                </div>
                <div className="auth-glass-metrics" aria-hidden="true">
                  <article>
                    <span>项目进度</span>
                    <strong>86%</strong>
                    <i>
                      <b />
                    </i>
                  </article>
                  <article>
                    <span>本周协作</span>
                    <strong>24</strong>
                    <small>+ 8.2%</small>
                  </article>
                </div>
              </div>
            </section>
            <div className="auth-glass-activity" aria-hidden="true">
              <span className="auth-glass-activity__icon">Q</span>
              <span>
                <strong>设计评审已更新</strong>
                <small>刚刚 · 产品体验组</small>
              </span>
              <i />
            </div>
            <div aria-hidden="true" className="auth-glass-dock">
              <span>
                <Icon icon="lucide:layout-dashboard" />
              </span>
              <span>
                <Icon icon="lucide:area-chart" />
              </span>
              <span className="is-active">
                <Icon icon="ion:layers-outline" />
              </span>
              <span>
                <Icon icon="lucide:users" />
              </span>
            </div>
          </div>
          <div className="auth-showcase__caption">
            <strong>专注当下，自然高效。</strong>
            <span>为现代团队打造的 React 管理工作台</span>
          </div>
        </div>
      </aside>
      <section className="auth-panel">
        <div className="auth-panel__content">
          <Outlet />
        </div>
        <footer>Copyright © 2026 Qing React Admin</footer>
      </section>
    </main>
  )
}
