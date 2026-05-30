import { atom } from 'jotai'

import { api, type shoppinglist } from '../api/api'
import { apiWrapper } from './apiWrapper'
import { piidAtom } from './atoms.app'
import { productsAtom, productsLoadedAtom, productsVersionAtom } from './products/atoms'
import { respToProducts } from './products/types'

export const fetchProductsAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    if (!piid) return

    const promise = api.GetProducts(piid)
    const resp = await apiWrapper(promise, { methodName: 'Produkte holen' })
    if (!resp.ok) return

    const products = respToProducts(resp.resp)
    set(productsAtom, products)
    set(productsLoadedAtom, true)
})

export const updateProductsAtom = atom(null, async (get, set, id: number, args: { name?: string, archive?: boolean }) => {
    const piid = get(piidAtom)
    if (!piid) return

    const patch: shoppinglist.PatchProductParams = {}
    const name = args.name
    const archive = args.archive
    if (name !== undefined) patch.name = name
    if (archive !== undefined) patch.archive = archive

    const resp = await apiWrapper(
        api.PatchProduct(piid, id, patch),
        { methodName: 'Produkt aktualisieren' },
    )
    if (!resp.ok) return

    const prev = get(productsAtom)
    const next = prev.map(p => p.id === id ? { ...p, name: name ?? p.name, archived: archive ?? p.archived } : p)
    set(productsAtom, next)
    set(productsVersionAtom, get(productsVersionAtom) + 1)
})

export const removeProductsAtom = atom(null, async (get, set, id: number) => {
    const piid = get(piidAtom)
    if (!piid) return

    const resp = await apiWrapper(
        api.DeleteProduct(piid, id),
        { methodName: 'Produkt löschen' },
    )
    if (!resp.ok) return

    const prev = get(productsAtom)
    const next = prev.filter(p => p.id !== id)
    set(productsAtom, next)
    set(productsVersionAtom, get(productsVersionAtom) + 1)
})
