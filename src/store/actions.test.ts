import { createStore } from 'jotai'
import type { Store } from 'jotai/vanilla/store'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { server } from '../__tests__/setupTest'
import type { shoppinglist } from '../api/api'
import { changeItemQuantityAtom, checkItemAtom, deleteItemAtom, deleteListAtom, fetchItemsAtom, postItemByIdAtom, postItemByNameAtom } from './actions.items'
import { fetchMomentsAtom } from './actions.moments'
import { piidAtom } from './atoms.app'
import { itemsAtom, itemsVersionAtom, listIdAtom } from './items/atoms'
import { productsVersionAtom } from './products/atoms'

describe('actions', () => {
    let store: Store
    beforeEach(() => {
        store = createStore()
        store.set(piidAtom, 'piid')
    })

    // describe('fetch data atom', () => {
    //     it('ok', async () => {
    //         await store.set(fetchDataAtom)

    //         const items = store.get(itemsAtom)
    //         expect(items).toHaveLength(2)
    //         const listId = store.get(listIdAtom)
    //         expect(listId).toBe(1)
    //         const products = store.get(productsAtom)
    //         expect(products).toHaveLength(3)

    //         const etag = store.get(etagAtom)
    //         expect(etag).toBe('123')

    //         const itemsLoaded = store.get(itemsLoadedAtom)
    //         expect(itemsLoaded).toBeTruthy()
    //     })

    //     it('404 creates an empty list', async () => {
    //         server.use(getMomentsHandler(HttpResponse.json({}, { status: 404 })))

    //         await store.set(fetchDataAtom)

    //         const listId = store.get(listIdAtom)
    //         expect(listId).toBe(2)
    //     })

    //     it('304 does nothing', async () => {
    //         server.use(getMomentsHandler(HttpResponse.json({}, { status: 304 })))

    //         await store.set(fetchDataAtom)
    //         const items = store.get(itemsAtom)
    //         expect(items).toHaveLength(0)
    //     })
    // })

    it('check item', async () => {
        await store.set(fetchItemsAtom)

        await store.set(checkItemAtom, 1)
        const items = store.get(itemsAtom)
        const item1 = items.find(i => i.id == 1)!
        expect(item1.checked).toBeTruthy()
    })

    it('change quatity', async () => {
        await store.set(fetchItemsAtom)

        await store.set(changeItemQuantityAtom, 1, 10)
        const item1 = store.get(itemsAtom).find(i => i.id == 1)!
        expect(item1.quantity).toBe(10)
    })

    describe('post item', () => {
        it('post by id', async () => {
            await store.set(fetchItemsAtom)

            await store.set(postItemByIdAtom, { id: 3 })

            const items = store.get(itemsAtom)
            expect(items).toHaveLength(3)
            const item3 = items.find(i => i.productId == 3)!
            expect(item3).toBeDefined()
        })
        it('post by name', async () => {
            await store.set(fetchItemsAtom)

            await store.set(postItemByNameAtom, { name: 'new name' })

            const items = store.get(itemsAtom)
            expect(items).toHaveLength(3)
        })
    })

    it('delete item', async () => {
        await store.set(fetchItemsAtom)

        await store.set(deleteItemAtom, 1)

        const items = store.get(itemsAtom)
        expect(items).toHaveLength(1)
        expect(items[0].id).not.toBe(1)
    })

    describe('delete list', () => {
        it('delete', async () => {
            await store.set(fetchItemsAtom)

            const ok = await store.set(deleteListAtom, false)

            expect(ok).toBeFalsy()
            const listId = store.get(listIdAtom)
            expect(listId).toBe(2)
        })
        it('with force', async () => {
            await store.set(fetchItemsAtom)

            const ok = await store.set(deleteListAtom, true)

            expect(ok).toBeTruthy()
        })
    })
})

describe('moments actions', () => {
    let store: Store
    beforeEach(() => {
        store = createStore()
        store.set(piidAtom, 'piid')
    })

    const mockMoments = (resp: shoppinglist.MomentsResponse) => server.use(http.get('/piid/:piid/moments', () => HttpResponse.json(resp)))

    it('no updates', async () => {
        store.set(itemsVersionAtom, 1)
        store.set(productsVersionAtom, 5)
        mockMoments({ itemsVersion: 1, productsVersion: 5 })

        await store.set(fetchMomentsAtom)

        expect(store.get(itemsVersionAtom)).toBe(1)
        expect(store.get(productsVersionAtom)).toBe(5)
    })

    it('both updates', async () => {
        store.set(itemsVersionAtom, 1)
        store.set(productsVersionAtom, 5)
        mockMoments({ itemsVersion: 2, productsVersion: 7 })

        await store.set(fetchMomentsAtom)

        expect(store.get(itemsVersionAtom)).toBe(2)
        expect(store.get(productsVersionAtom)).toBe(7)
    })

    it('item updates', async () => {
        store.set(itemsVersionAtom, 1)
        store.set(productsVersionAtom, 5)
        mockMoments({ itemsVersion: 2, productsVersion: 5 })

        await store.set(fetchMomentsAtom)

        expect(store.get(itemsVersionAtom)).toBe(2)
        expect(store.get(productsVersionAtom)).toBe(5)
    })

    it('product updates', async () => {
        store.set(itemsVersionAtom, 1)
        store.set(productsVersionAtom, 5)
        mockMoments({ itemsVersion: 1, productsVersion: 10 })

        await store.set(fetchMomentsAtom)

        expect(store.get(itemsVersionAtom)).toBe(1)
        expect(store.get(productsVersionAtom)).toBe(10)
    })
})
