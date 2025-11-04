import { atom } from 'jotai'
import { client } from '../api/api'

type Product = {
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

export const productsAtom = atom<Array<Product>>([])

export const fetchProducts = atom(null, async (_get, set) => {
    const products = await getProducts()
    set(productsAtom, products)
})