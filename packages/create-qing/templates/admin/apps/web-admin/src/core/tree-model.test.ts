import { describe, expect, it } from 'vitest'

import { appendTree, flattenTree, removeTree, updateTree } from './tree-model'

interface Node {
  children?: Node[]
  id: string
  title: string
}

const tree: Node[] = [{ children: [{ id: 'child', title: 'Child' }], id: 'root', title: 'Root' }]

describe('immutable tree model', () => {
  it('updates nested nodes without mutating the input', () => {
    const result = updateTree(tree, 'child', (node) => ({ ...node, title: 'Updated' }))
    expect(flattenTree(result).map((node) => node.title)).toEqual(['Root', 'Updated'])
    expect(tree[0]?.children?.[0]?.title).toBe('Child')
  })

  it('appends at the root or a nested parent', () => {
    expect(appendTree(tree, '0', { id: 'second', title: 'Second' })).toHaveLength(2)
    const nested = appendTree(tree, 'root', { id: 'second', title: 'Second' })
    expect(nested[0]?.children).toHaveLength(2)
  })

  it('removes a subtree while preserving unrelated records', () => {
    const result = removeTree(tree, 'child')
    expect(result).toEqual([{ children: [], id: 'root', title: 'Root' }])
  })
})
