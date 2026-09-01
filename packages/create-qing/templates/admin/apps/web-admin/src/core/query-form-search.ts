import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { z } from 'zod'
import type { ZodType } from 'zod'

const dayjsType = 'dayjs'
const queryFormParameter = 'qf'
const queryFormPrefix = 'j:'

type EncodedQueryValue =
  | boolean
  | null
  | number
  | string
  | EncodedQueryValue[]
  | { [key: string]: EncodedQueryValue }

type QueryFormSearchState = Record<string, Record<string, unknown>>
export type QueryFormUrlSchema<Values extends object> = ZodType<{
  [Property in keyof Values]?: Values[Property] | undefined
}>

export const queryFormSearchSchema = z
  .object({ qf: z.string().max(20_000).optional() })
  .catchall(z.unknown())

const queryFormStateSchema = z.record(z.string(), z.record(z.string(), z.unknown()))

/** URL 解码后的日期必须仍是合法 Dayjs，业务页面不再信任通用 JSON 形状。 */
export const queryFormDayjsSchema = z.custom<Dayjs>(
  (value) => dayjs.isDayjs(value) && value.isValid(),
)

function encodeValue(value: unknown): EncodedQueryValue | undefined {
  if (value === undefined) return undefined
  if (dayjs.isDayjs(value)) {
    return { $type: dayjsType, value: value.toISOString() }
  }
  if (Array.isArray(value)) {
    return value.map((item) => encodeValue(item) ?? null)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, encodeValue(item)] as const)
        .filter((entry): entry is readonly [string, EncodedQueryValue] => entry[1] !== undefined),
    )
  }
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return value
  }
  return undefined
}

function decodeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(decodeValue)
  if (value !== null && typeof value === 'object') {
    const encodedType = Reflect.get(value, '$type')
    const encodedDate = Reflect.get(value, 'value')
    if (encodedType === dayjsType && typeof encodedDate === 'string') {
      const parsed = dayjs(encodedDate)
      return parsed.isValid() ? parsed : undefined
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decodeValue(item)]))
  }
  return value
}

function parseState(value: string | null): QueryFormSearchState {
  if (!value?.startsWith(queryFormPrefix)) return {}
  try {
    const parsed = queryFormStateSchema.safeParse(JSON.parse(value.slice(queryFormPrefix.length)))
    return parsed.success ? parsed.data : {}
  } catch {
    return {}
  }
}

function readParameter(search: string) {
  return new URLSearchParams(search).get(queryFormParameter)
}

export function readQueryFormSearch<Values extends object>(
  search: string,
  namespace: string,
  schema: QueryFormUrlSchema<Values>,
) {
  const encodedValues = parseState(readParameter(search))[namespace]
  if (!encodedValues) return undefined
  const result = schema.safeParse(decodeValue(encodedValues))
  if (!result.success) return undefined
  const values = Object.fromEntries(
    Object.entries(result.data).filter((entry) => entry[1] !== undefined),
  )
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Undefined optional properties are removed so the exact-optional form contract is preserved after schema validation.
  return values as Partial<Values>
}

export function queryFormSearchSignature(search: string, namespace: string) {
  const encodedValues = parseState(readParameter(search))[namespace]
  return encodedValues ? JSON.stringify(encodedValues) : null
}

export function writeQueryFormSearch(search: string, namespace: string, values?: object) {
  const parameters = new URLSearchParams(search)
  const state = parseState(parameters.get(queryFormParameter))
  const encodedValues = values ? encodeValue(values) : undefined

  if (
    encodedValues &&
    typeof encodedValues === 'object' &&
    !Array.isArray(encodedValues) &&
    Object.keys(encodedValues).length > 0
  ) {
    state[namespace] = encodedValues
  } else {
    delete state[namespace]
  }

  if (Object.keys(state).length > 0) {
    parameters.set(queryFormParameter, `${queryFormPrefix}${JSON.stringify(state)}`)
  } else {
    parameters.delete(queryFormParameter)
  }
  const nextSearch = parameters.toString()
  return nextSearch ? `?${nextSearch}` : ''
}
