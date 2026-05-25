import { getDefaultStore } from 'jotai'
import { expect, test } from 'vitest'

import { itemsAtom } from './items/atoms'
import { productsAtom } from './products/atoms'
import { itemAtom, itemsWithNamesAtom } from './selectors'

test('items with names', () => {
    const store = getDefaultStore()
    store.set(itemsAtom, [{ id: 1, productId: 1, checked: false }])
    store.set(productsAtom, [{ id: 1, name: 'name', archived: false }])

    const products = store.get(itemsWithNamesAtom)
    expect(products).toHaveLength(1)
    expect(products[0].productName).toBe('name')
})

test('item atom', () => {
    const store = getDefaultStore()
    store.set(itemsAtom, [{ id: 1, productId: 1, checked: false }])

    const item = store.get(itemAtom)(1)
    expect(item).toBeDefined()
    expect(item.id).toBe(1)
    expect(item.productId).toBe(1)
    expect(item.checked).toBeFalsy()
})
