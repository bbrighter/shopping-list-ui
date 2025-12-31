import { atom } from 'jotai'

import { itemsAtom, productsAtom, resetPollingAtom } from './atoms.items'

export const itemAtom = atom(get => (id: number) => (
    get(itemsAtom).find(it => it.id == id)!
))

export const itemsWithNamesAtom = atom((get) => {
    const items = get(itemsAtom)
    const products = get(productsAtom)
    const itemsWithProducts = items.map(it => ({
        ...it, productName: products.find(p => p.id == it.productId)?.name,
    }))
    return itemsWithProducts
})

export const productsNotInUseAtom = atom((get) => {
    const products = get(productsAtom)
    const items = get(itemsAtom)
    return products.filter(p => !items.some(i => i.productId == p.id))
})

export const pollingStateAtom = atom((get) => {
    const polling = get(resetPollingAtom)
    return polling
})
