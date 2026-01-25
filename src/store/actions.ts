import { atom } from 'jotai'

import { api } from '../api/api'
import { apiWrapper } from './apiWrapper'
import { etagAtom, piidAtom } from './atoms.app'
import { itemsAtom, itemsLoadedAtom, listIdAtom, productsAtom, resetPollingAtom } from './atoms.items'
import { itemAtom } from './selectors'
import { type Item, type Product, respToData, respToItem } from './types'

export const fetchDataAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    if (!piid) return

    const ifNoneMatch = get(etagAtom)
    const promise = api.GetMoments(piid, { IfNoneMatch: ifNoneMatch })
    const resp = await apiWrapper(promise, { methodName: 'Daten holen', supressStatusCodes: [304] })
    if (!resp.ok) {
        if (resp.statusCode == 404) {
            const resp = await api.PostList(piid)
            set(listIdAtom, resp.id)
            return
        }
        return
    }
    const { listId, items, products, etag } = respToData(resp.resp)
    set(listIdAtom, listId)
    set(itemsAtom, items)
    set(itemsLoadedAtom, true)
    set(productsAtom, products)
    set(etagAtom, etag)
})

export const createListAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    const promise = api.PostList(piid)
    const resp = await apiWrapper(promise, { methodName: 'Liste erstellen' })
    if (!resp.ok) {
        return
    }
    set(listIdAtom, resp.resp.id)
    set(itemsAtom, [])
    set(resetPollingAtom, v => v + 1)
})

export const checkItemAtom = atom(null, async (get, set, id: number) => {
    const piid = get(piidAtom)
    const item = get(itemAtom)(id)
    const previousItems = get(itemsAtom)
    const checkedItem = { ...item, checked: !item.checked }
    const newItems = get(itemsAtom).map(it => it.id == id ? checkedItem : it)
    set(itemsAtom, newItems)
    const promise = api.CheckItem(piid, id, { checked: !item.checked })
    const resp = await apiWrapper(promise, { methodName: 'Eintrag checken' })
    if (!resp.ok) {
        set(itemsAtom, previousItems)
        return
    }
    set(resetPollingAtom, v => v + 1)
})

const debounceTimer = new Map<number, number>()

export const changeItemQuantityAtom = atom(null, async (get, set, id: number, newQuantity?: number) => {
    const piid = get(piidAtom)
    const item = get(itemAtom)(id)
    const previousItems = get(itemsAtom)
    const newItem = { ...item, quantity: newQuantity }
    const newItems = get(itemsAtom).map(it => it.id == id ? newItem : it)

    set(itemsAtom, newItems)

    const existing = debounceTimer.get(id)
    if (existing) clearTimeout(existing)
    const timeout = window.setTimeout(async () => {
        debounceTimer.delete(id)
        const promise = api.PatchItem(piid, id, { quantity: newQuantity ?? 0 })
        const resp = await apiWrapper(promise, { methodName: 'Anzahl ändern' })
        if (!resp.ok) {
            set(itemsAtom, previousItems)
        }
    }, 500)

    debounceTimer.set(id, timeout)

    set(resetPollingAtom, v => v + 1)
})

type PostItemParams = { piid: string, listId: number, id: number } | { piid: string, listId: number, name: string }

const postItem = async (args: PostItemParams): Promise<{ item: Item, product?: Product }> => {
    const { listId, piid } = args
    let item = {} as Item
    let product
    if ('id' in args) {
        const resp = await api.PostItem(piid, listId, args.id)
        item = { id: resp.id, checked: false, productId: args.id }
    }
    else {
        const resp = await api.PostItemByName(piid, listId, { name: args.name })
        item = respToItem(resp)
        product = { id: item.productId, name: args.name } as Product
    }
    return { item: item, product: product }
}

export const postItemAtom = atom(null, async (get, set, args: { id: number } | { name: string }) => {
    const piid = get(piidAtom)
    const promise = postItem({ piid: piid, listId: get(listIdAtom), ...args })
    const resp = await apiWrapper(promise, { methodName: 'Neuer Eintrag' })
    if (!resp.ok) return
    const { item, product } = resp.resp
    if (product) {
        set(productsAtom, prev => [...prev, product])
    }
    const itemProductName = get(productsAtom).find(p => p.id == item.productId)!.name
    item.productName = itemProductName
    const newItems = [...get(itemsAtom), item]
    set(itemsAtom, newItems)
    set(resetPollingAtom, v => v + 1)
})

export const deleteItemAtom = atom(null, async (get, set, id: number) => {
    const piid = get(piidAtom)
    const originalItems = get(itemsAtom)
    const newItems = get(itemsAtom).filter(it => it.id != id)
    set(itemsAtom, newItems)

    const promise = api.DeleteItem(piid, id)
    const resp = await apiWrapper(promise, { methodName: 'Eintrag löschen' })
    if (!resp.ok) {
        set(itemsAtom, originalItems)
        return
    }
    set(resetPollingAtom, v => v + 1)
})

export const deleteListAtom = atom(null, async (get, set, force: boolean) => {
    const piid = get(piidAtom)
    const listId = get(listIdAtom)

    const promise = api.DeleteList(piid, listId, { Force: force })
    const resp = await apiWrapper(promise, { methodName: 'Liste löschen', supressStatusCodes: [400] })
    if (!resp.ok) {
        return false
    }
    set(resetPollingAtom, v => v + 1)
    return true
})
