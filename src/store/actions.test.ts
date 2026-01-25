import { createStore } from 'jotai'
import type { Store } from 'jotai/vanilla/store'
import { HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { server } from '../__tests__/setupTest'
import { getMomentsHandler } from '../__tests__/shoppingListHandler'
import { changeItemQuantityAtom, checkItemAtom, deleteItemAtom, deleteListAtom, fetchDataAtom, postItemAtom } from './actions'
import { etagAtom, piidAtom } from './atoms.app'
import { itemsAtom, itemsLoadedAtom, listIdAtom, productsAtom } from './atoms.items'

describe('actions', () => {
    let store: Store
    beforeEach(() => {
        store = createStore()
        store.set(piidAtom, 'piid')
    })

    describe('fetch data atom', () => {
        it('ok', async () => {
            await store.set(fetchDataAtom)

            const items = store.get(itemsAtom)
            expect(items).toHaveLength(2)
            const listId = store.get(listIdAtom)
            expect(listId).toBe(1)
            const products = store.get(productsAtom)
            expect(products).toHaveLength(3)

            const etag = store.get(etagAtom)
            expect(etag).toBe('123')

            const itemsLoaded = store.get(itemsLoadedAtom)
            expect(itemsLoaded).toBeTruthy()
        })

        it('404 creates an empty list', async () => {
            server.use(getMomentsHandler(HttpResponse.json({}, { status: 404 })))

            await store.set(fetchDataAtom)

            const listId = store.get(listIdAtom)
            expect(listId).toBe(2)
        })

        it('304 does nothing', async () => {
            server.use(getMomentsHandler(HttpResponse.json({}, { status: 304 })))

            await store.set(fetchDataAtom)
            const items = store.get(itemsAtom)
            expect(items).toHaveLength(0)
        })
    })

    it('check item', async () => {
        await store.set(fetchDataAtom)

        await store.set(checkItemAtom, 1)
        const items = store.get(itemsAtom)
        const item1 = items.find(i => i.id == 1)!
        expect(item1.checked).toBeTruthy()
    })

    it('change quatity', async () => {
        await store.set(fetchDataAtom)

        await store.set(changeItemQuantityAtom, 1, 10)
        const item1 = store.get(itemsAtom).find(i => i.id == 1)!
        expect(item1.quantity).toBe(10)
    })

    describe('post item', () => {
        it('post by id', async () => {
            await store.set(fetchDataAtom)

            await store.set(postItemAtom, { id: 3 })

            const items = store.get(itemsAtom)
            expect(items).toHaveLength(3)
            const item3 = items.find(i => i.productId == 3)!
            expect(item3).toBeDefined()
            expect(item3.productName).toBe('prod3')
        })
        it('post by name', async () => {
            await store.set(fetchDataAtom)

            await store.set(postItemAtom, { name: 'new name' })

            const items = store.get(itemsAtom)
            expect(items).toHaveLength(3)
            const item3 = items.find(i => i.productName == 'new name')!
            expect(item3).toBeDefined()
        })
    })

    it('delete item', async () => {
        await store.set(fetchDataAtom)

        await store.set(deleteItemAtom, 1)

        const items = store.get(itemsAtom)
        expect(items).toHaveLength(1)
        expect(items[0].id).not.toBe(1)
    })

    describe('delete list', () => {
        it('delete', async () => {
            await store.set(fetchDataAtom)

            const ok = await store.set(deleteListAtom, false)

            expect(ok).toBeFalsy()
            const listId = store.get(listIdAtom)
            expect(listId).toBe(1)
        })
        it('with force', async () => {
            await store.set(fetchDataAtom)

            const ok = await store.set(deleteListAtom, true)

            expect(ok).toBeTruthy()
        })
    })
})
