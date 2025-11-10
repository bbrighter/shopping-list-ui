import { atom } from 'jotai'
import { client } from '../api/api'
import { itemsAtom } from './items'

export type Product = {
    id: number
    name: string
}


const getProducts = async (): Promise<Product[]> => {
    const resp = await client.ListProducts()
    return resp.products.map(p => ({
        id: p.id,
        name: p.name,
    }))
}

const productIsLoadedAtom = atom(false)

export const productsAtom = atom<Array<Product>>([])

export const fetchProducts = atom(null, async (get, set) => {
    if (get(productIsLoadedAtom)) return
    const products = await getProducts()
    set(productsAtom, products)
    set(productIsLoadedAtom, true)
})

export const productsNotInUseAtom = atom((get) => {
    const products = get(productsAtom)
    const items = get(itemsAtom)
    return products.filter(p => !items.some(i => i.productId == p.id))
})