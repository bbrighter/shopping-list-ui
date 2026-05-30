import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import { itemsAtom } from './items/atoms'
import { productsAtom } from './products/atoms'

export const itemAtom = atomFamily((id: number) => atom(get => get(itemsAtom).find(it => it.id === id)!))

export const itemsWithNamesAtom = atom((get) => {
    const items = get(itemsAtom)
    const products = get(productsAtom)
    const itemsWithProducts = items.map(it => ({
        ...it, productName: products.find(p => p.id == it.productId)?.name,
    }))
    return itemsWithProducts
})

export const sortedProductsAtom = atom((get) => {
    return [...get(productsAtom)].sort((a, b) => a.name.localeCompare(b.name))
})

export const nonArchivedProductsAtom = atom((get) => {
    return get(sortedProductsAtom).filter(p => !p.archived)
})
