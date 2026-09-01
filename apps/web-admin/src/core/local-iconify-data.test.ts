import { describe, expect, it } from 'vitest'

import { localIconifyCollections, localIconNames } from './local-iconify-data'

describe('local Iconify data', () => {
  it('contains every statically referenced icon', () => {
    const bundledNames = new Set(
      localIconifyCollections.flatMap((collection) =>
        [...Object.keys(collection.icons), ...Object.keys(collection.aliases ?? {})].map(
          (name) => `${collection.prefix}:${name}`,
        ),
      ),
    )

    expect(localIconNames.filter((name) => !bundledNames.has(name))).toEqual([])
  })
})
