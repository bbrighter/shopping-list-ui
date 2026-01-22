import { atom } from 'jotai'

import { api, isAPIError } from '../api/api'
import { etagAtom, piidAtom } from './atoms.app'
import { itemsAtom, listIdAtom, productsAtom, resetPollingAtom } from './atoms.items'
import { handleException } from './error'
import { itemAtom } from './selectors'
import { type Item, type Product, respToData, respToItem } from './types'

export const fetchDataAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    if (!piid) return
    try {
        const ifNoneMatch = get(etagAtom)
        const resp = await api.GetMoments(piid, { IfNoneMatch: ifNoneMatch })
        const { listId, items, products, etag } = respToData(resp)
        set(listIdAtom, listId)
        set(itemsAtom, items)
        set(productsAtom, products)
        set(etagAtom, etag)
    }
    catch (error) {
        if (isAPIError(error) && error.status == 304) {
            return
        }
        if (isAPIError(error) && error.status == 404) {
            const resp = await api.PostList(piid)
            set(listIdAtom, resp.id)
            return
        }
        handleException(error, 'Daten holen')
    }
})

export const createListAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    const resp = await api.PostList(piid)
    set(listIdAtom, resp.id)
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
    try {
        await api.CheckItem(piid, id, { checked: !item.checked })
        set(resetPollingAtom, v => v + 1)
    }
    catch (e) {
        handleException(e, 'Eintrag checken')
        set(itemsAtom, previousItems)
    }
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
        try {
            debounceTimer.delete(id)
            await api.PatchItem(piid, id, { quantity: newQuantity ?? 0 })
        }
        catch (e) {
            handleException(e, 'Anzahl ändern')
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
    const { item, product } = await postItem({ piid: piid, listId: get(listIdAtom), ...args })
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
    try {
        await api.DeleteItem(piid, id)
    }
    catch (e) {
        handleException(e, 'Eintrag löschen')
        set(itemsAtom, originalItems)
    }
    set(resetPollingAtom, v => v + 1)
})

export const deleteListAtom = atom(null, async (get, set, force: boolean) => {
    const piid = get(piidAtom)
    try {
        const listId = get(listIdAtom)
        await api.DeleteList(piid, listId, { Force: force })
        set(resetPollingAtom, v => v + 1)
        return true
    }
    catch (e) {
        if (isAPIError(e) && e.status == 400 && e.message.includes('unchecked items exist')) {
            return false
        }
        handleException(e, 'Liste löschen')
        return false
    }
})
