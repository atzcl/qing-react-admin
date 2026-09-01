import { addCollection } from '@iconify/react'

import { localIconifyCollections } from './local-iconify-data'

for (const collection of localIconifyCollections) {
  if (!addCollection(collection)) {
    throw new Error(`Unable to register the local Iconify collection: ${collection.prefix}`)
  }
}
