import { getDefaultStore } from 'jotai'
import { expect, test } from 'vitest'

import { itemsAtom } from './items/atoms'
import { productsAtom } from './products/atoms'
import { itemAtom, itemsWithNamesAtom, nonArchivedProductsAtom, sortedProductsAtom } from './selectors'

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

    const item = store.get(itemAtom(1))
    expect(item).toBeDefined()
    expect(item.id).toBe(1)
    expect(item.productId).toBe(1)
    expect(item.checked).toBeFalsy()
})

test('sorted products atom', () => {
    const store = getDefaultStore()
    store.set(productsAtom, [
        { id: 1, archived: false, name: 'A' },
        { id: 2, archived: false, name: 'C' },
        { id: 3, archived: false, name: 'B' },
    ])

    const sortedProducts = store.get(sortedProductsAtom)
    expect(sortedProducts.map(p => p.id)).toStrictEqual([1, 3, 2])
})

test('non-archived products atom', () => {
    const store = getDefaultStore()
    store.set(productsAtom, [
        { id: 1, archived: true, name: 'A' },
        { id: 2, archived: false, name: 'C' },
        { id: 3, archived: false, name: 'B' },
    ])

    const products = store.get(nonArchivedProductsAtom)
    expect(products.map(p => p.id)).toStrictEqual([3, 2])
})
