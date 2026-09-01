import { Form, Radio, Tag } from 'antd'

import { menuTypeOptions } from './model'
import type { BinaryStatus, MenuRecord } from './model'

export function statusTag(status: BinaryStatus) {
  return <Tag color={status === 1 ? 'success' : 'error'}>{status === 1 ? '启用' : '禁用'}</Tag>
}

export function BinaryStatusField({ label = '状态' }: { label?: string }) {
  return (
    <Form.Item initialValue={1} label={label} name="status">
      <Radio.Group
        buttonStyle="solid"
        optionType="button"
        options={[
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ]}
      />
    </Form.Item>
  )
}

export function menuTypeTag(type: MenuRecord['type']) {
  const option = menuTypeOptions.find((item) => item.value === type)
  return <Tag {...(option ? { color: option.color } : {})}>{option?.label ?? type}</Tag>
}
