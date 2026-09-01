import { DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import { App as AntdApp, Button, Dropdown, Popconfirm } from 'antd'
import type { ButtonProps, DropdownProps, MenuProps, ModalFuncProps, PopconfirmProps } from 'antd'
import { Fragment } from 'react'
import type { CSSProperties, Key, MouseEvent, ReactElement, ReactNode } from 'react'

export type ButtonListPermissionBehavior = 'disabled' | 'hidden'
export type ButtonListGap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 'small' | 'middle' | 'large'
export type ButtonListActionHandler = (event?: MouseEvent<HTMLElement>) => unknown
export type ButtonListMessageBoxProps = ModalFuncProps
export type ButtonListItemDropdownProps = Omit<DropdownProps, 'children' | 'popupRender'>

export interface ButtonListDropdownProps extends Omit<
  DropdownProps,
  'children' | 'menu' | 'popupRender'
> {
  buttonProps?: Omit<ButtonProps, 'children' | 'icon'>
  icon?: ReactNode
  renderTrigger?: (items: readonly ButtonListItem[]) => ReactElement
}

export interface ButtonListItem extends Omit<
  ButtonProps,
  'children' | 'disabled' | 'icon' | 'loading' | 'onClick' | 'size' | 'type'
> {
  disabled?: ButtonProps['disabled']
  dropdown?: ButtonListItemDropdownProps
  icon?: ReactNode
  key: Key
  label?: ReactNode
  loading?: ButtonProps['loading']
  menu?: DropdownProps['menu']
  messageBox?: ButtonListMessageBoxProps
  onClick?: ButtonListActionHandler
  permission?: string
  popconfirm?: PopconfirmProps
  render?: ReactElement
  size?: ButtonProps['size']
  type?: ButtonProps['type']
}

export interface ButtonListProps {
  className?: string
  disabled?: ButtonProps['disabled']
  dropdown?: ButtonListDropdownProps
  gap?: ButtonListGap
  list: readonly ButtonListItem[]
  loading?: ButtonProps['loading']
  max?: number
  permissionBehavior?: ButtonListPermissionBehavior
  permissions?: ReadonlySet<string>
  size?: ButtonProps['size']
  type?: ButtonProps['type']
}

export interface ButtonListSplitResult<T> {
  overflow: T[]
  visible: T[]
}

type ButtonListStyle = CSSProperties & { '--button-list-gap': string }

/**
 * 项目级按钮组：统一按钮间距、权限、二次确认、确认弹窗与溢出菜单。
 * API 与 Qing ui-kit 的 ButtonList 保持一致，图标直接接收 ReactNode。
 */
export function ButtonList({
  className,
  disabled,
  dropdown,
  gap = 2,
  list,
  loading,
  max,
  permissionBehavior = 'disabled',
  permissions,
  size,
  type,
}: ButtonListProps): ReactElement | null {
  const { modal } = AntdApp.useApp()
  const renderableItems = filterButtonListItemsByPermission(list, permissions, permissionBehavior)
  const { overflow, visible } = splitButtonListItems(renderableItems, max)
  const overflowOptions = { defaultDisabled: disabled, defaultLoading: loading, permissions }

  if (visible.length === 0 && overflow.length === 0) return null
  const style: ButtonListStyle = { '--button-list-gap': resolveButtonListGap(gap) }

  return (
    <div className={['button-list', className].filter(Boolean).join(' ')} style={style}>
      {visible.map((item) =>
        renderButtonListItem(item, {
          defaultDisabled: disabled,
          defaultLoading: loading,
          defaultSize: size,
          defaultType: type,
          modal,
          permissions,
        }),
      )}
      {overflow.length > 0 ? (
        <Dropdown
          placement="bottomRight"
          trigger={['hover']}
          {...dropdown}
          menu={{
            items: createButtonListOverflowMenuItems(overflow, overflowOptions),
            onClick: ({ key }) => {
              const item = overflow.find((candidate) => String(candidate.key) === key)
              if (!item || isOverflowItemDisabled(item, overflowOptions)) return
              invokeButtonListAction(undefined, item.messageBox, modal, item.onClick)
            },
          }}
        >
          {dropdown?.renderTrigger ? (
            dropdown.renderTrigger(overflow)
          ) : (
            <Button
              {...dropdown?.buttonProps}
              aria-label={dropdown?.buttonProps?.['aria-label'] ?? '更多操作'}
              icon={dropdown?.icon ?? <EllipsisOutlined />}
              size={dropdown?.buttonProps?.size ?? size}
              type={dropdown?.buttonProps?.type ?? 'text'}
            />
          )}
        </Dropdown>
      ) : null}
    </div>
  )
}

export function splitButtonListItems<T>(
  list: readonly T[],
  max?: number,
): ButtonListSplitResult<T> {
  if (max === undefined || !Number.isFinite(max)) return { overflow: [], visible: [...list] }
  const normalizedMax = Math.max(0, Math.trunc(max))
  if (list.length <= normalizedMax) return { overflow: [], visible: [...list] }
  return { overflow: list.slice(normalizedMax), visible: list.slice(0, normalizedMax) }
}

export function filterButtonListItemsByPermission(
  list: readonly ButtonListItem[],
  permissions: ReadonlySet<string> | undefined,
  behavior: ButtonListPermissionBehavior,
): ButtonListItem[] {
  return behavior === 'hidden'
    ? list.filter((item) => isButtonListItemAllowed(item, permissions))
    : [...list]
}

export function isButtonListItemAllowed(
  item: Pick<ButtonListItem, 'permission'>,
  permissions?: ReadonlySet<string>,
): boolean {
  return !item.permission || !permissions || permissions.has(item.permission)
}

export function createButtonListOverflowMenuItems(
  list: readonly ButtonListItem[],
  options: {
    defaultDisabled: ButtonProps['disabled'] | undefined
    defaultLoading: ButtonProps['loading'] | undefined
    permissions: ReadonlySet<string> | undefined
  },
): NonNullable<MenuProps['items']> {
  return list.map((item) => ({
    ...(item.danger !== undefined ? { danger: item.danger } : {}),
    disabled: isOverflowItemDisabled(item, options),
    ...(item.icon !== undefined ? { icon: item.icon } : {}),
    key: String(item.key),
    label: item.label,
  }))
}

function renderButtonListItem(
  item: ButtonListItem,
  options: {
    defaultDisabled: ButtonProps['disabled'] | undefined
    defaultLoading: ButtonProps['loading'] | undefined
    defaultSize: ButtonProps['size'] | undefined
    defaultType: ButtonProps['type'] | undefined
    modal: ReturnType<typeof AntdApp.useApp>['modal']
    permissions: ReadonlySet<string> | undefined
  },
): ReactElement {
  if (item.render) return <Fragment key={item.key}>{item.render}</Fragment>

  const {
    disabled,
    dropdown,
    icon,
    key,
    label,
    loading,
    menu,
    messageBox,
    onClick,
    permission: _permission,
    popconfirm,
    render: _render,
    size,
    type,
    ...buttonProps
  } = item
  const itemDropdown = dropdown ?? (menu ? { menu } : undefined)
  const resolvedLoading = loading ?? options.defaultLoading
  const resolvedSize = size ?? options.defaultSize
  const resolvedType = type ?? options.defaultType
  const onButtonClick = popconfirm
    ? undefined
    : (event: MouseEvent<HTMLElement>) =>
        invokeButtonListAction(event, messageBox, options.modal, onClick)
  const button = (
    <Button
      {...buttonProps}
      className={[
        resolvedType === 'link' || resolvedType === 'text' ? 'button-list__text-action' : undefined,
        buttonProps.className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={
        options.defaultDisabled || disabled || !isButtonListItemAllowed(item, options.permissions)
      }
      {...(icon !== undefined ? { icon } : {})}
      {...(resolvedLoading !== undefined ? { loading: resolvedLoading } : {})}
      {...(onButtonClick ? { onClick: onButtonClick } : {})}
      {...(resolvedSize !== undefined ? { size: resolvedSize } : {})}
      {...(resolvedType ? { type: resolvedType } : {})}
    >
      {label}
      {itemDropdown ? <DownOutlined className="button-list__dropdown-icon" /> : null}
    </Button>
  )
  const confirmedButton = popconfirm ? (
    <Popconfirm
      {...popconfirm}
      onConfirm={(event) => {
        popconfirm.onConfirm?.(event)
        invokeButtonListAction(event, messageBox, options.modal, onClick)
      }}
    >
      {button}
    </Popconfirm>
  ) : (
    button
  )

  return (
    <Fragment key={key}>
      {itemDropdown ? (
        <Dropdown placement="bottomRight" trigger={['click']} {...itemDropdown}>
          {confirmedButton}
        </Dropdown>
      ) : (
        confirmedButton
      )}
    </Fragment>
  )
}

function isOverflowItemDisabled(
  item: ButtonListItem,
  options: {
    defaultDisabled: ButtonProps['disabled'] | undefined
    defaultLoading: ButtonProps['loading'] | undefined
    permissions: ReadonlySet<string> | undefined
  },
): boolean {
  return Boolean(
    options.defaultDisabled ||
    item.disabled ||
    !isButtonListItemAllowed(item, options.permissions) ||
    (item.loading ?? options.defaultLoading),
  )
}

function invokeButtonListAction(
  event: MouseEvent<HTMLElement> | undefined,
  messageBox: ButtonListMessageBoxProps | undefined,
  modal: ReturnType<typeof AntdApp.useApp>['modal'],
  action: ButtonListActionHandler | undefined,
) {
  if (!messageBox) {
    void action?.(event)
    return
  }
  modal.confirm({
    ...messageBox,
    onOk: async (...args) => {
      const result = await messageBox.onOk?.(...args)
      await action?.(event)
      return result
    },
  })
}

function resolveButtonListGap(gap: ButtonListGap): string {
  if (gap === 'small' || gap === 1) return '4px'
  if (gap === 'large' || gap === 3) return '12px'
  if (gap === 'middle' || gap === 2) return '8px'
  return `${gap * 4}px`
}
