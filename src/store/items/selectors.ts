import { atom } from 'jotai';
import { itemsAtom } from './atoms';
import { productsAtom } from '../products';

export const itemAtom = atom((get) => (id: number) => (
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