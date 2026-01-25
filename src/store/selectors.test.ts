import { getDefaultStore } from 'jotai'
import { describe, expect, it, test } from 'vitest'

import { itemsAtom, productsAtom } from './atoms.items'
import { itemAtom, itemsWithNamesAtom, listCanBeClosedAtom, productsNotInUseAtom } from './selectors'

test('items with names', () => {
    const store = getDefaultStore()
    store.set(itemsAtom, [{ id: 1, productId: 1, checked: false }])
    store.set(productsAtom, [{ id: 1, name: 'name' }])

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

test('products not in use atom', () => {
    const store = getDefaultStore()
    store.set(itemsAtom, [{ id: 1, productId: 1, checked: false }])
    store.set(productsAtom, [
        { id: 1, name: 'name' },
        { id: 2, name: 'name 2' },
    ])

    const productsNotInUse = store.get(productsNotInUseAtom)
    expect(productsNotInUse).toHaveLength(1)
    expect(productsNotInUse[0].id).toBe(2)
})

describe('list can be closed atom', () => {
    it('can be closed', () => {
        const store = getDefaultStore()
        store.set(itemsAtom, [
            { id: 1, productId: 1, checked: true },
            { id: 2, productId: 2, checked: true },
        ])

        const canBeClosed = store.get(listCanBeClosedAtom)
        expect(canBeClosed).toBeTruthy()
    })

    it('cannot be closed', () => {
        const store = getDefaultStore()
        store.set(itemsAtom, [
            { id: 1, productId: 1, checked: true },
            { id: 2, productId: 2, checked: false },
        ])

        const canBeClosed = store.get(listCanBeClosedAtom)
        expect(canBeClosed).toBeFalsy()
    })
})
