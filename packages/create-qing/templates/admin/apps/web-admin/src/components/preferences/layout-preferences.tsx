import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Button, Divider, Input, InputNumber, Segmented, Select, Slider } from 'antd'

import { updatePreferences, useAppSelector, useAppStore } from '~/core/app-store'
import type { NavigationMode } from '~/core/types'
import { useTranslation } from '~/core/use-translation'

import {
  getWidgetPreferencePosition,
  headerWidgetByKey,
  preferencePositionOptions,
  setWidgetPosition,
} from '../header-widgets'
import { PreferenceBlock, SwitchRow } from './preference-primitives'

const layoutOptions: Array<{ label: string; value: NavigationMode }> = [
  { label: '垂直', value: 'sidebar-nav' },
  { label: '双列菜单', value: 'sidebar-mixed-nav' },
  { label: '水平', value: 'header-nav' },
  { label: '顶部侧栏', value: 'header-sidebar-nav' },
  { label: '混合菜单', value: 'mixed-nav' },
  { label: '顶部双列', value: 'header-mixed-nav' },
  { label: '内容全屏', value: 'full-content' },
]

export function LayoutPreferences() {
  const appStore = useAppStore()
  const preferences = useAppSelector((state) => state.preferences)
  const t = useTranslation()
  const isSideMode = [
    'header-mixed-nav',
    'header-sidebar-nav',
    'mixed-nav',
    'sidebar-mixed-nav',
    'sidebar-nav',
  ].includes(preferences.navigationMode)

  function moveWidget(index: number, offset: -1 | 1) {
    const target = index + offset
    if (target < 0 || target >= preferences.widgetOrder.length) return
    const next = [...preferences.widgetOrder]
    const current = next[index]
    const adjacent = next[target]
    if (!current || !adjacent) return
    next[index] = adjacent
    next[target] = current
    updatePreferences(appStore, { widgetOrder: next })
  }

  return (
    <div className="preference-tab-content">
      <PreferenceBlock title="布局预设">
        <div className="layout-preset-grid">
          {layoutOptions.map((option) => (
            <button
              className={
                preferences.navigationMode === option.value
                  ? 'layout-preset is-active'
                  : 'layout-preset'
              }
              key={option.value}
              onClick={() => updatePreferences(appStore, { navigationMode: option.value })}
              type="button"
            >
              <span className={`layout-preset__preview is-${option.value}`}>
                <i />
                <i />
                <i />
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="内容">
        <Segmented
          block
          onChange={(value) => {
            if (value === 'compact' || value === 'wide') {
              updatePreferences(appStore, { contentCompact: value })
            }
          }}
          options={[
            { label: '流式', value: 'wide' },
            { label: '定宽', value: 'compact' },
          ]}
          value={preferences.contentCompact}
        />
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="侧边栏">
        <SwitchRow
          checked={preferences.sidebarEnable}
          disabled={!isSideMode}
          label="显示侧边栏"
          onChange={(sidebarEnable) => updatePreferences(appStore, { sidebarEnable })}
        />
        <SwitchRow
          checked={preferences.sidebarDraggable}
          disabled={!isSideMode || !preferences.sidebarEnable}
          label="允许拖拽调整宽度"
          onChange={(sidebarDraggable) => updatePreferences(appStore, { sidebarDraggable })}
        />
        <SwitchRow
          checked={preferences.sidebarCollapsed}
          disabled={!isSideMode || !preferences.sidebarEnable}
          label="折叠侧边栏"
          onChange={(sidebarCollapsed) => updatePreferences(appStore, { sidebarCollapsed })}
        />
        <SwitchRow
          checked={preferences.sidebarCollapsedShowTitle}
          disabled={!isSideMode || !preferences.sidebarEnable || !preferences.sidebarCollapsed}
          label="折叠时显示菜单标题"
          onChange={(sidebarCollapsedShowTitle) =>
            updatePreferences(appStore, { sidebarCollapsedShowTitle })
          }
        />
        <SwitchRow
          checked={preferences.sidebarAutoActivateChild}
          disabled={
            !isSideMode ||
            !preferences.sidebarEnable ||
            !['header-mixed-nav', 'mixed-nav', 'sidebar-mixed-nav'].includes(
              preferences.navigationMode,
            )
          }
          label="自动激活子菜单"
          onChange={(sidebarAutoActivateChild) =>
            updatePreferences(appStore, { sidebarAutoActivateChild })
          }
        />
        <div className="preference-check-grid">
          <Button
            onClick={() =>
              updatePreferences(appStore, {
                sidebarCollapsedButton: !preferences.sidebarCollapsedButton,
              })
            }
            size="small"
            type={preferences.sidebarCollapsedButton ? 'primary' : 'default'}
          >
            折叠按钮
          </Button>
          <Button
            onClick={() =>
              updatePreferences(appStore, { sidebarFixedButton: !preferences.sidebarFixedButton })
            }
            size="small"
            type={preferences.sidebarFixedButton ? 'primary' : 'default'}
          >
            固定按钮
          </Button>
        </div>
        <label className="preference-slider">
          <span>侧栏宽度</span>
          <Slider
            disabled={!isSideMode || !preferences.sidebarEnable}
            max={320}
            min={160}
            onChange={(sidebarWidth) => updatePreferences(appStore, { sidebarWidth })}
            step={10}
            value={preferences.sidebarWidth}
          />
        </label>
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="顶栏">
        <SwitchRow
          checked={preferences.headerEnable}
          disabled={preferences.navigationMode === 'full-content'}
          label="显示顶栏"
          onChange={(headerEnable) => updatePreferences(appStore, { headerEnable })}
        />
        <label className="preference-field-row">
          <span>模式</span>
          <Select
            disabled={!preferences.headerEnable}
            onChange={(headerMode) => updatePreferences(appStore, { headerMode })}
            options={[
              { label: '静态', value: 'static' },
              { label: '固定', value: 'fixed' },
              { label: '自动隐藏', value: 'auto' },
              { label: '滚动隐藏', value: 'auto-scroll' },
            ]}
            value={preferences.headerMode}
          />
        </label>
        <label className="preference-field-row">
          <span>菜单位置</span>
          <Segmented
            disabled={!preferences.headerEnable}
            onChange={(headerMenuAlign) => {
              if (
                headerMenuAlign === 'start' ||
                headerMenuAlign === 'center' ||
                headerMenuAlign === 'end'
              ) {
                updatePreferences(appStore, { headerMenuAlign })
              }
            }}
            options={[
              { label: '居左', value: 'start' },
              { label: '居中', value: 'center' },
              { label: '居右', value: 'end' },
            ]}
            value={preferences.headerMenuAlign}
          />
        </label>
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="导航菜单">
        <Segmented
          block
          onChange={(value) => {
            if (value === 'plain' || value === 'rounded') {
              updatePreferences(appStore, { navigationStyle: value })
            }
          }}
          options={[
            { label: '圆润', value: 'rounded' },
            { label: '朴素', value: 'plain' },
          ]}
          value={preferences.navigationStyle}
        />
        <SwitchRow
          checked={preferences.navigationSplit}
          disabled={preferences.navigationMode !== 'mixed-nav'}
          label="切割菜单"
          onChange={(navigationSplit) => updatePreferences(appStore, { navigationSplit })}
        />
        <SwitchRow
          checked={preferences.navigationAccordion}
          label="手风琴模式"
          onChange={(navigationAccordion) => updatePreferences(appStore, { navigationAccordion })}
        />
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="面包屑导航">
        <SwitchRow
          checked={preferences.showBreadcrumb}
          label="显示面包屑"
          onChange={(showBreadcrumb) => updatePreferences(appStore, { showBreadcrumb })}
        />
        <SwitchRow
          checked={preferences.breadcrumbHideOnlyOne}
          disabled={!preferences.showBreadcrumb}
          label="仅一项时隐藏"
          onChange={(breadcrumbHideOnlyOne) =>
            updatePreferences(appStore, { breadcrumbHideOnlyOne })
          }
        />
        <SwitchRow
          checked={preferences.showBreadcrumbIcon}
          disabled={!preferences.showBreadcrumb}
          label="显示图标"
          onChange={(showBreadcrumbIcon) => updatePreferences(appStore, { showBreadcrumbIcon })}
        />
        <SwitchRow
          checked={preferences.showBreadcrumbHome}
          disabled={!preferences.showBreadcrumb || !preferences.showBreadcrumbIcon}
          label="显示首页"
          onChange={(showBreadcrumbHome) => updatePreferences(appStore, { showBreadcrumbHome })}
        />
        <label className="preference-field-row">
          <span>风格</span>
          <Segmented
            disabled={!preferences.showBreadcrumb}
            onChange={(breadcrumbStyle) => {
              if (breadcrumbStyle === 'normal' || breadcrumbStyle === 'background') {
                updatePreferences(appStore, { breadcrumbStyle })
              }
            }}
            options={[
              { label: '普通', value: 'normal' },
              { label: '背景', value: 'background' },
            ]}
            value={preferences.breadcrumbStyle}
          />
        </label>
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="标签页">
        <SwitchRow
          checked={preferences.showTabs}
          label={t('preferences.tabs')}
          onChange={(showTabs) => updatePreferences(appStore, { showTabs })}
        />
        <SwitchRow
          checked={preferences.tabPersist}
          disabled={!preferences.showTabs}
          label="持久化标签页"
          onChange={(tabPersist) => updatePreferences(appStore, { tabPersist })}
        />
        <SwitchRow
          checked={preferences.tabVisitHistory}
          disabled={!preferences.showTabs}
          label="记录访问历史"
          onChange={(tabVisitHistory) => updatePreferences(appStore, { tabVisitHistory })}
        />
        <label className="preference-field-row">
          <span>最大数量</span>
          <InputNumber
            disabled={!preferences.showTabs}
            max={30}
            min={0}
            onChange={(value) => {
              if (typeof value === 'number') updatePreferences(appStore, { tabMaxCount: value })
            }}
            step={5}
            value={preferences.tabMaxCount}
          />
        </label>
        <SwitchRow
          checked={preferences.tabDraggable}
          disabled={!preferences.showTabs}
          label="允许拖拽"
          onChange={(tabDraggable) => updatePreferences(appStore, { tabDraggable })}
        />
        <SwitchRow
          checked={preferences.tabWheelable}
          disabled={!preferences.showTabs}
          label="鼠标滚轮切换"
          onChange={(tabWheelable) => updatePreferences(appStore, { tabWheelable })}
        />
        <SwitchRow
          checked={preferences.tabMiddleClickToClose}
          disabled={!preferences.showTabs}
          label="鼠标中键关闭"
          onChange={(tabMiddleClickToClose) =>
            updatePreferences(appStore, { tabMiddleClickToClose })
          }
        />
        <SwitchRow
          checked={preferences.showTabIcons}
          disabled={!preferences.showTabs}
          label="显示图标"
          onChange={(showTabIcons) => updatePreferences(appStore, { showTabIcons })}
        />
        <SwitchRow
          checked={preferences.showTabMore}
          disabled={!preferences.showTabs}
          label="显示更多按钮"
          onChange={(showTabMore) => updatePreferences(appStore, { showTabMore })}
        />
        <Segmented
          block
          onChange={(value) => {
            if (value === 'brisk' || value === 'card' || value === 'chrome' || value === 'plain') {
              updatePreferences(appStore, { tabStyle: value })
            }
          }}
          options={[
            { label: 'Chrome', value: 'chrome' },
            { label: '卡片', value: 'card' },
            { label: '轻快', value: 'brisk' },
            { label: '朴素', value: 'plain' },
          ]}
          value={preferences.tabStyle}
        />
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="界面功能">
        <div className="preference-widget-list">
          {preferences.widgetOrder.map((key, index) => {
            const definition = headerWidgetByKey.get(key)
            if (!definition) return null
            const value = getWidgetPreferencePosition(definition, preferences)
            return (
              <div className="preference-widget-item" key={key}>
                <span>{definition.label}</span>
                <Select
                  onChange={(position) => setWidgetPosition(appStore, definition, position)}
                  options={preferencePositionOptions(definition)}
                  size="small"
                  value={value}
                />
                <span className="preference-widget-item__sort">
                  <Button
                    disabled={index === 0}
                    icon={<ArrowUpOutlined />}
                    onClick={() => moveWidget(index, -1)}
                    size="small"
                    type="text"
                  />
                  <Button
                    disabled={index === preferences.widgetOrder.length - 1}
                    icon={<ArrowDownOutlined />}
                    onClick={() => moveWidget(index, 1)}
                    size="small"
                    type="text"
                  />
                </span>
              </div>
            )
          })}
        </div>
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="底栏">
        <SwitchRow
          checked={preferences.showFooter}
          label="显示底栏"
          onChange={(showFooter) => updatePreferences(appStore, { showFooter })}
        />
        <SwitchRow
          checked={preferences.footerFixed}
          disabled={!preferences.showFooter}
          label="固定底栏"
          onChange={(footerFixed) => updatePreferences(appStore, { footerFixed })}
        />
      </PreferenceBlock>
      <Divider />
      <PreferenceBlock title="版权">
        <SwitchRow
          checked={preferences.copyrightEnable}
          disabled={!preferences.showFooter}
          label="显示版权"
          onChange={(copyrightEnable) => updatePreferences(appStore, { copyrightEnable })}
        />
        {(
          [
            ['copyrightCompanyName', '公司名称'],
            ['copyrightCompanySiteLink', '公司链接'],
            ['copyrightDate', '日期'],
            ['copyrightIcp', '备案号'],
            ['copyrightIcpLink', '备案链接'],
          ] as const
        ).map(([key, label]) => (
          <label className="preference-field-row" key={key}>
            <span>{label}</span>
            <Input
              disabled={!preferences.showFooter || !preferences.copyrightEnable}
              onChange={(event) => updatePreferences(appStore, { [key]: event.target.value })}
              value={preferences[key]}
            />
          </label>
        ))}
      </PreferenceBlock>
    </div>
  )
}
