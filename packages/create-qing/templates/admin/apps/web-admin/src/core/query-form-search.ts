import dayjs from 'dayjs'
import { z } from 'zod'

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

export const queryFormSearchSchema = z
  .object({ qf: z.string().max(20_000).optional() })
  .catchall(z.unknown())

const queryFormStateSchema = z.record(z.string(), z.record(z.string(), z.unknown()))

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

export function readQueryFormSearch<Values extends object>(search: string, namespace: string) {
  const encodedValues = parseState(readParameter(search))[namespace]
  if (!encodedValues) return undefined
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- The route schema and recursive decoder validate the URL boundary; the page supplies the concrete form shape.
  return decodeValue(encodedValues) as Partial<Values>
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
