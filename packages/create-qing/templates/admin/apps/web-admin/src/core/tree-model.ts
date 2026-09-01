export interface IdentifiedTreeNode<T> {
  children?: T[]
  id: string
}

export function flattenTree<T extends IdentifiedTreeNode<T>>(nodes: readonly T[]): T[] {
  return nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])])
}

export function updateTree<T extends IdentifiedTreeNode<T>>(
  nodes: readonly T[],
  id: string,
  update: (node: T) => T,
): T[] {
  return nodes.map((node) => {
    if (node.id === id) return update(node)
    if (!node.children) return node
    return { ...node, children: updateTree(node.children, id, update) }
  })
}

export function removeTree<T extends IdentifiedTreeNode<T>>(nodes: readonly T[], id: string): T[] {
  const result: T[] = []
  for (const node of nodes) {
    if (node.id === id) continue
    if (!node.children) {
      result.push(node)
      continue
    }

    const children = removeTree(node.children, id)
    const unchanged =
      children.length === node.children.length &&
      children.every((child, index) => child === node.children?.[index])
    result.push(unchanged ? node : { ...node, children })
  }
  return result
}

export function appendTree<T extends IdentifiedTreeNode<T>>(
  nodes: readonly T[],
  parentId: string,
  child: T,
): T[] {
  if (parentId === '0') return [...nodes, child]
  return updateTree(nodes, parentId, (node) => ({
    ...node,
    children: [...(node.children ?? []), child],
  }))
}
