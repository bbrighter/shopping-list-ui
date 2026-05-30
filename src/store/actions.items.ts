import { atom } from 'jotai'

import { api } from '../api/api'
import { apiWrapper } from './apiWrapper'
import { piidAtom } from './atoms.app'
import { itemsAtom, itemsLoadedAtom, listIdAtom, resetPollingAtom } from './items/atoms'
import { respToItem, respToList } from './items/types'
import { productsAtom } from './products/atoms'
import { itemAtom } from './selectors'

export const fetchItemsAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    if (!piid) return

    const promise = api.PostOrGetList(piid)
    const resp = await apiWrapper(promise, { methodName: 'Liste holen' })
    if (!resp.ok) return

    const { listId, items } = respToList(resp.resp)
    set(listIdAtom, listId)
    set(itemsAtom, items)
    set(itemsLoadedAtom, true)
})

export const checkItemAtom = atom(null, async (get, set, id: number) => {
    const piid = get(piidAtom)
    const item = get(itemAtom(id))
    const previousItems = get(itemsAtom)
    const checkedItem = { ...item, checked: !item.checked }
    const newItems = get(itemsAtom).map(it => it.id == id ? checkedItem : it)
    set(itemsAtom, newItems)
    const promise = api.PatchItem(piid, id, { checked: !item.checked })
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
    const item = get(itemAtom(id))
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

export const postItemByNameAtom = atom(null, async (get, set, args: { name: string }) => {
    const piid = get(piidAtom)
    const resp = await apiWrapper(
        api.PostItemByName(piid, get(listIdAtom), { name: args.name }),
        { methodName: 'Neuer Eintrag' },
    )
    if (!resp.ok) return

    const newItems = [respToItem(resp.resp), ...get(itemsAtom)]
    set(itemsAtom, newItems)
    const newProducts = [...get(productsAtom), { id: resp.resp.productId, name: args.name, archived: false }]
    set(productsAtom, newProducts)
    set(resetPollingAtom, v => v + 1)
})

export const postItemByIdAtom = atom(null, async (get, set, args: { id: number }) => {
    const piid = get(piidAtom)
    const resp = await apiWrapper(
        api.PostItem(piid, get(listIdAtom), args.id),
        { methodName: 'Neuer Eintrag' },
    )
    if (!resp.ok) return

    const newItems = [{ id: resp.resp.id, productId: args.id, checked: false }, ...get(itemsAtom)]
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
    const resp = await apiWrapper(promise, { methodName: 'Liste löschen', suppressStatusCodes: [400] })
    if (!resp.ok) {
        return false
    }

    set(itemsAtom, [])
    set(resetPollingAtom, 0)
    return true
})
