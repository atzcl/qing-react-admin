import { useRouter, useRouterState } from '@tanstack/react-router'
import { Form } from 'antd'
import type { ButtonProps, FormInstance, FormItemProps, FormProps } from 'antd'
import type { NamePath } from 'antd/es/form/interface.js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CSSProperties, Key, ReactElement, ReactNode } from 'react'

import { useAdminPage } from '~/core/admin-page-context'
import {
  queryFormSearchSignature,
  readQueryFormSearch,
  writeQueryFormSearch,
} from '~/core/query-form-search'

import { ButtonList } from './button-list'

export type QueryFormValues = object

type QueryFormStyle = CSSProperties & {
  '--query-form-collapsed-height'?: string
  '--query-form-expanded-height'?: string
}

type QueryFormValueSource<Values extends QueryFormValues> =
  | { kind: 'controlled'; value: Partial<Values> }
  | { kind: 'default'; value: Partial<Values> }
  | { kind: 'reset'; value: Partial<Values> }

export interface QueryFormRenderContext<Values extends QueryFormValues> {
  disabled: boolean
  form: FormInstance<Values>
  loading: boolean
  size: ButtonProps['size']
}

interface QueryFormItemBase<Values extends QueryFormValues> {
  className?: string
  hidden?: boolean
  key?: Key
  render: (context: QueryFormRenderContext<Values>) => ReactNode
}

export interface QueryFormFieldItem<
  Values extends QueryFormValues,
> extends QueryFormItemBase<Values> {
  field?: NamePath<Values>
  formItemProps?: Omit<FormItemProps<Values>, 'children' | 'label' | 'name'>
  initialValue?: unknown
  label: ReactNode
  name?: NamePath<Values>
  standalone?: false
}

export interface QueryFormStandaloneItem<
  Values extends QueryFormValues,
> extends QueryFormItemBase<Values> {
  standalone: true
}

export type QueryFormItem<Values extends QueryFormValues> =
  | QueryFormFieldItem<Values>
  | QueryFormStandaloneItem<Values>

export type QueryFormValidateErrorHandler = (error: unknown) => void

const collapsedItemCount = 3
const defaultLabelWidth = 80
const defaultWrapperCol = { flex: '1 1 0' } as const
const queryFormMotionDuration = 240

export interface QueryFormLocale {
  collapseText: ReactNode
  expandText: ReactNode
  queryText: ReactNode
  resetText: ReactNode
}

const defaultLocale: QueryFormLocale = {
  collapseText: 'Collapse',
  expandText: 'Expand',
  queryText: 'Search',
  resetText: 'Reset',
}

const QueryFormLocaleContext = createContext<QueryFormLocale>(defaultLocale)
/** Activity 重连或懒加载重挂载时，保留当前会话中各页面最后一次已提交的 URL 查询。 */
const runtimeQueryFormValues = new Map<string, object>()

export interface QueryFormProps<Values extends QueryFormValues> extends Omit<
  FormProps<Values>,
  | 'children'
  | 'disabled'
  | 'form'
  | 'initialValues'
  | 'layout'
  | 'onFinish'
  | 'onFinishFailed'
  | 'onReset'
  | 'size'
> {
  actions?: ReactNode
  collapseText?: ReactNode
  disabled?: boolean
  expandText?: ReactNode
  immediate?: boolean
  items: readonly QueryFormItem<Values>[]
  labelWidth?: number | string
  loading?: boolean
  onlyReset?: boolean
  onQuery: (values: Values) => Promise<void> | void
  onReset?: (values: Values) => Promise<void> | void
  onValidateError?: QueryFormValidateErrorHandler
  queryText?: ReactNode
  resetText?: ReactNode
  resetValidate?: boolean
  resetValues?: Partial<Values>
  size?: ButtonProps['size']
  validate?: boolean
  values?: Partial<Values>
  urlSync?: boolean | { namespace?: string; replace?: boolean }
}

export function QueryFormLocaleProvider({
  children,
  locale,
}: {
  children?: ReactNode
  locale: QueryFormLocale
}): ReactElement {
  return (
    <QueryFormLocaleContext.Provider value={locale}>{children}</QueryFormLocaleContext.Provider>
  )
}

export function QueryForm<Values extends QueryFormValues>({
  urlSync,
  ...props
}: QueryFormProps<Values>): ReactElement {
  return urlSync ? (
    <UrlSyncedQueryForm {...props} options={typeof urlSync === 'boolean' ? {} : urlSync} />
  ) : (
    <QueryFormContent {...props} />
  )
}

interface UrlSyncedQueryFormProps<Values extends QueryFormValues> extends Omit<
  QueryFormProps<Values>,
  'urlSync'
> {
  options: { namespace?: string; replace?: boolean }
}

function resolveQueryFormValues<Values extends QueryFormValues>(values: Partial<Values>): Values {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Query forms model optional filters; validated URL/default values are a complete submit payload at runtime.
  return values as Values
}

function UrlSyncedQueryForm<Values extends QueryFormValues>({
  options,
  ...props
}: UrlSyncedQueryFormProps<Values>) {
  const router = useRouter()
  const adminPage = useAdminPage()
  const location = useRouterState({
    select: (state) => ({
      hash: state.location.hash,
      pathname: state.location.pathname,
      search: state.location.searchStr,
    }),
  })
  const namespace = options.namespace ?? 'default'
  const replace = options.replace ?? true
  const active = adminPage.pathname === location.pathname
  const runtimeKey = `${adminPage.pathname}:${namespace}`
  const urlValues = useMemo(
    () => readQueryFormSearch<Values>(location.search, namespace),
    [location.search, namespace],
  )
  const runtimeValues = runtimeQueryFormValues.get(runtimeKey) as Partial<Values> | undefined
  const searchSignature = queryFormSearchSignature(location.search, namespace)
  const defaultValues = useMemo(() => createQueryFormDefaultValues(props.items), [props.items])
  const resetValues = props.resetValues ?? defaultValues
  const resolvedValues = urlValues ?? runtimeValues ?? props.values ?? resetValues
  const wasActiveRef = useRef(false)
  const previousSignatureRef = useRef<string | null>(null)
  const pendingSignatureRef = useRef<{ active: boolean; value: string | null }>({
    active: false,
    value: null,
  })
  const onQueryRef = useRef(props.onQuery)
  const onResetRef = useRef(props.onReset)

  useEffect(() => {
    onQueryRef.current = props.onQuery
    onResetRef.current = props.onReset
  }, [props.onQuery, props.onReset])

  const updateUrl = useCallback(
    async (values?: Values) => {
      const nextSearch = writeQueryFormSearch(location.search, namespace, values)
      pendingSignatureRef.current = {
        active: true,
        value: queryFormSearchSignature(nextSearch, namespace),
      }
      await router.navigate({
        href: `${location.pathname}${nextSearch}${location.hash}`,
        replace,
      })
    },
    [location.hash, location.pathname, location.search, namespace, replace, router],
  )

  useEffect(() => {
    if (!active) {
      wasActiveRef.current = false
      return
    }

    const wasActive = wasActiveRef.current
    const previousSignature = previousSignatureRef.current
    wasActiveRef.current = true
    previousSignatureRef.current = searchSignature
    if (
      pendingSignatureRef.current.active &&
      pendingSignatureRef.current.value === searchSignature
    ) {
      pendingSignatureRef.current.active = false
      return
    }
    if (!wasActive) {
      if (urlValues) {
        runtimeQueryFormValues.set(runtimeKey, urlValues)
        void onQueryRef.current(resolveQueryFormValues(urlValues))
      } else if (runtimeValues) {
        const nextRuntimeValues = resolveQueryFormValues(runtimeValues)
        void updateUrl(nextRuntimeValues)
        void onQueryRef.current(nextRuntimeValues)
      }
      return
    }
    if (previousSignature === searchSignature) return
    if (urlValues) {
      runtimeQueryFormValues.set(runtimeKey, urlValues)
      void onQueryRef.current(resolveQueryFormValues(urlValues))
      return
    }
    runtimeQueryFormValues.delete(runtimeKey)
    const nextResetValues = resolveQueryFormValues(resetValues)
    if (onResetRef.current) void onResetRef.current(nextResetValues)
    else void onQueryRef.current(nextResetValues)
  }, [active, resetValues, runtimeKey, runtimeValues, searchSignature, updateUrl, urlValues])

  async function handleQuery(values: Values) {
    runtimeQueryFormValues.set(runtimeKey, values)
    await updateUrl(values)
    await props.onQuery(values)
  }

  async function handleReset(values: Values) {
    runtimeQueryFormValues.delete(runtimeKey)
    await updateUrl()
    if (props.onReset) await props.onReset(values)
    else await props.onQuery(values)
  }

  return (
    <QueryFormContent
      {...props}
      onQuery={handleQuery}
      onReset={handleReset}
      values={resolvedValues}
    />
  )
}

/** Qing-compatible schema query form for list pages. */
function QueryFormContent<Values extends QueryFormValues>({
  actions,
  className,
  collapseText,
  disabled = false,
  expandText,
  immediate = false,
  items,
  labelWidth = defaultLabelWidth,
  loading = false,
  onlyReset = false,
  onQuery,
  onReset,
  onValidateError,
  queryText,
  resetText,
  resetValidate = true,
  resetValues,
  size = 'middle',
  validate = true,
  values,
  ...formProps
}: Omit<QueryFormProps<Values>, 'urlSync'>): ReactElement {
  const [form] = Form.useForm<Values>()
  const fieldAreaId = useId()
  const locale = useContext(QueryFormLocaleContext)
  const [internalLoading, setInternalLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [renderAllItems, setRenderAllItems] = useState(false)
  const onQueryRef = useRef(onQuery)
  const onResetRef = useRef(onReset)
  const onValidateErrorRef = useRef(onValidateError)
  const lastValueSourceRef = useRef<QueryFormValueSource<Values> | undefined>(undefined)
  const fieldsRef = useRef<HTMLDivElement>(null)
  const expandFrameRef = useRef<number | null>(null)
  const collapseTimerRef = useRef<number | null>(null)
  const [fieldHeights, setFieldHeights] = useState({ collapsed: 0, expanded: 0 })
  const resolvedLoading = loading || internalLoading
  const resolvedDisabled = disabled || resolvedLoading
  const defaultValues = useMemo(() => createQueryFormDefaultValues(items), [items])
  const resolvedResetValues = resetValues ?? defaultValues

  useEffect(() => {
    onQueryRef.current = onQuery
    onResetRef.current = onReset
    onValidateErrorRef.current = onValidateError
  }, [onQuery, onReset, onValidateError])

  useEffect(() => {
    const nextSource: QueryFormValueSource<Values> =
      values !== undefined
        ? { kind: 'controlled', value: values }
        : resetValues !== undefined
          ? { kind: 'reset', value: resetValues }
          : { kind: 'default', value: resolvedResetValues }
    const previousSource = lastValueSourceRef.current
    const sourceUnchanged =
      previousSource?.kind === nextSource.kind &&
      (nextSource.kind === 'default' || previousSource.value === nextSource.value)
    if (sourceUnchanged) return

    form.setFieldsValue(nextSource.value)
    lastValueSourceRef.current = nextSource
  }, [form, resetValues, resolvedResetValues, values])

  const readValues = useCallback(
    async (shouldValidate: boolean): Promise<Values> => {
      if (shouldValidate) await form.validateFields()
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- AntD types the all-fields overload as any, while the FormInstance retains Values at runtime.
      return form.getFieldsValue(true) as Values
    },
    [form],
  )

  const runQuery = useCallback(async (nextValues: Values) => {
    setInternalLoading(true)
    try {
      await onQueryRef.current(nextValues)
    } finally {
      setInternalLoading(false)
    }
  }, [])

  const handleQuery = useCallback(async () => {
    try {
      await runQuery(await readValues(validate))
    } catch (error) {
      onValidateErrorRef.current?.(error)
    }
  }, [readValues, runQuery, validate])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- immediate intentionally starts the same async query lifecycle after mount.
    if (immediate) void handleQuery()
  }, [handleQuery, immediate])

  const handleReset = useCallback(async () => {
    try {
      form.resetFields()
      form.setFieldsValue(resolvedResetValues)
      if (onlyReset) return

      const nextValues = await readValues(validate && resetValidate)
      setInternalLoading(true)
      try {
        if (onResetRef.current) await onResetRef.current(nextValues)
        else await onQueryRef.current(nextValues)
      } finally {
        setInternalLoading(false)
      }
    } catch (error) {
      onValidateErrorRef.current?.(error)
    }
  }, [form, onlyReset, readValues, resetValidate, resolvedResetValues, validate])

  const renderContext: QueryFormRenderContext<Values> = {
    disabled: resolvedDisabled,
    form,
    loading: resolvedLoading,
    size,
  }
  const visibleItems = items.filter((item) => !item.hidden)
  const collapsible = visibleItems.length > collapsedItemCount
  const renderedItems = renderAllItems ? visibleItems : visibleItems.slice(0, collapsedItemCount)
  const renderedItemCount = renderedItems.length
  const resolvedLabelWidth = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth

  const updateFieldHeights = useCallback(() => {
    const fields = fieldsRef.current
    if (!fields) return

    const fieldsBounds = fields.getBoundingClientRect()
    const children = Array.from(fields.children)
    const collapsedChild = children[Math.min(collapsedItemCount, children.length) - 1]
    const collapsedHeight = collapsedChild
      ? Math.ceil(collapsedChild.getBoundingClientRect().bottom - fieldsBounds.top)
      : 0
    const expandedHeight = Math.ceil(fields.scrollHeight)

    setFieldHeights((current) =>
      current.collapsed === collapsedHeight && current.expanded === expandedHeight
        ? current
        : { collapsed: collapsedHeight, expanded: expandedHeight },
    )
  }, [])

  useLayoutEffect(() => {
    if (renderedItemCount === 0) return undefined
    updateFieldHeights()
    if (typeof ResizeObserver === 'undefined') return undefined

    const fields = fieldsRef.current
    if (!fields) return undefined
    const observer = new ResizeObserver(updateFieldHeights)
    observer.observe(fields)
    return () => observer.disconnect()
  }, [renderedItemCount, updateFieldHeights])

  useEffect(
    () => () => {
      if (expandFrameRef.current !== null) window.cancelAnimationFrame(expandFrameRef.current)
      if (collapseTimerRef.current !== null) window.clearTimeout(collapseTimerRef.current)
    },
    [],
  )

  function toggleExpanded() {
    if (expandFrameRef.current !== null) {
      window.cancelAnimationFrame(expandFrameRef.current)
      expandFrameRef.current = null
    }
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current)
      collapseTimerRef.current = null
    }

    if (expanded) {
      setExpanded(false)
      collapseTimerRef.current = window.setTimeout(() => {
        setRenderAllItems(false)
        collapseTimerRef.current = null
      }, queryFormMotionDuration)
      return
    }

    setRenderAllItems(true)
    expandFrameRef.current = window.requestAnimationFrame(() => {
      expandFrameRef.current = null
      setExpanded(true)
    })
  }

  const fieldViewportStyle: QueryFormStyle | undefined = collapsible
    ? {
        '--query-form-collapsed-height': `${fieldHeights.collapsed || 1000}px`,
        '--query-form-expanded-height': `${fieldHeights.expanded || 2000}px`,
      }
    : undefined

  return (
    <Form<Values>
      {...formProps}
      className={['query-form', className].filter(Boolean).join(' ')}
      disabled={resolvedDisabled}
      form={form}
      labelAlign={formProps.labelAlign ?? 'left'}
      labelCol={formProps.labelCol ?? { flex: resolvedLabelWidth }}
      size={size}
      wrapperCol={formProps.wrapperCol ?? defaultWrapperCol}
      onFinish={handleQuery}
      onFinishFailed={(error) => onValidateErrorRef.current?.(error)}
    >
      <div className="query-form__layout">
        <div
          className={[
            'query-form__fields-viewport',
            collapsible ? 'is-collapsible' : '',
            expanded ? 'is-expanded' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={fieldViewportStyle}
        >
          <div className="query-form__fields" id={fieldAreaId} ref={fieldsRef}>
            {renderedItems.map((item, index) => {
              const isCollapsed = collapsible && !expanded && index >= collapsedItemCount
              if (item.standalone) {
                return (
                  <div
                    aria-hidden={isCollapsed || undefined}
                    className={[
                      'query-form__field',
                      isCollapsed ? 'is-collapsed' : '',
                      item.className,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    key={item.key ?? index}
                  >
                    <div className="query-form__standalone">{item.render(renderContext)}</div>
                  </div>
                )
              }

              const fieldName = item.field ?? item.name
              return (
                <div
                  aria-hidden={isCollapsed || undefined}
                  className={['query-form__field', isCollapsed ? 'is-collapsed' : '']
                    .filter(Boolean)
                    .join(' ')}
                  key={item.key ?? resolveQueryFormItemKey(fieldName, index)}
                >
                  <Form.Item<Values>
                    {...item.formItemProps}
                    className={['query-form__item', item.className].filter(Boolean).join(' ')}
                    label={item.label}
                    {...(fieldName !== undefined ? { name: fieldName } : {})}
                  >
                    {item.render(renderContext)}
                  </Form.Item>
                </div>
              )
            })}
          </div>
        </div>

        <ButtonList
          className="query-form__actions"
          list={[
            {
              htmlType: 'submit',
              key: 'query',
              label: queryText ?? locale.queryText,
              loading: resolvedLoading,
              type: 'primary',
            },
            {
              disabled: resolvedDisabled,
              htmlType: 'button',
              key: 'reset',
              label: resetText ?? locale.resetText,
              onClick: () => handleReset(),
            },
            ...(collapsible
              ? [
                  {
                    'aria-controls': fieldAreaId,
                    'aria-expanded': expanded,
                    disabled: resolvedDisabled,
                    htmlType: 'button' as const,
                    key: 'collapse',
                    label: expanded
                      ? (collapseText ?? locale.collapseText)
                      : (expandText ?? locale.expandText),
                    onClick: toggleExpanded,
                    type: 'link' as const,
                  },
                ]
              : []),
            ...(actions ? [{ key: 'custom-actions', render: <>{actions}</> }] : []),
          ]}
        />
      </div>
    </Form>
  )
}

export function createQueryFormDefaultValues<Values extends QueryFormValues>(
  items: readonly QueryFormItem<Values>[],
): Partial<Values> {
  const result: Partial<Values> = {}
  for (const item of items) {
    if (!item.standalone) assignDefaultValue(result, item.field ?? item.name, item.initialValue)
  }
  return result
}

function assignDefaultValue<Values extends QueryFormValues>(
  values: object,
  namePath: NamePath<Values> | undefined,
  value: unknown,
) {
  const path = Array.isArray(namePath)
    ? namePath.filter(
        (segment): segment is string | number =>
          typeof segment === 'string' || typeof segment === 'number',
      )
    : typeof namePath === 'string' || typeof namePath === 'number'
      ? [namePath]
      : []
  if (path.length === 0) return

  let cursor = values
  for (const segment of path.slice(0, -1)) {
    const current: unknown = Reflect.get(cursor, segment)
    const next = isPlainRecord(current) ? current : {}
    Reflect.set(cursor, segment, next)
    cursor = next
  }
  const lastSegment = path.at(-1)
  if (lastSegment !== undefined) Reflect.set(cursor, lastSegment, value)
}

function isPlainRecord(value: unknown): value is Record<string | number, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function resolveQueryFormItemKey(namePath: unknown, index: number): string {
  if (Array.isArray(namePath)) {
    const segments = namePath.filter(
      (segment): segment is string | number =>
        typeof segment === 'string' || typeof segment === 'number',
    )
    if (segments.length === namePath.length) return segments.map(String).join('.')
  }
  if (typeof namePath === 'string' || typeof namePath === 'number') return String(namePath)
  return `query-field-${index}`
}
