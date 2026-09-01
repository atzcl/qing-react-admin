export type OverlayKey =
  | 'auto'
  | 'base'
  | 'blur'
  | 'content'
  | 'drag'
  | 'dynamic'
  | 'form'
  | 'nested'
  | 'shared'
  | 'typed-auto'
  | 'typed-explicit'
  | 'typed-factory'

export interface OverlayDemo {
  description: string
  key: OverlayKey
  title: string
}

export interface SharedData {
  content: string
  payload: string
}

export interface TypedData {
  message: string
  method: '契约工厂' | '显式泛型' | '自动推导'
}

export const typedData: Record<'typed-auto' | 'typed-explicit' | 'typed-factory', TypedData> = {
  'typed-auto': {
    message: '外部无需声明泛型，由 connected component 自动推导。',
    method: '自动推导',
  },
  'typed-explicit': {
    message: '父子组件显式引用同一个数据类型。',
    method: '显式泛型',
  },
  'typed-factory': {
    message: '父子组件复用预绑定的 typed composable。',
    method: '契约工厂',
  },
}

export function isTypedDemo(key: OverlayKey): key is keyof typeof typedData {
  return key.startsWith('typed-')
}
