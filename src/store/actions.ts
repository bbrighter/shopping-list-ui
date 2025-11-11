import { atom } from 'jotai'
import { itemsAtom, listIdAtom, listIsLoadedAtom, productIsLoadedAtom, productsAtom } from './atoms'
import { client } from '../api/api'
import { type Product } from './types'
import { itemAtom } from './selectors'
import { respToItem, respToList, type Item } from './types'

export const fetchListAtom = atom(null, async (get, set) => {
    if (get(listIsLoadedAtom)) return

    const resp = await client.GetOrCreateList()
    const list = respToList(resp)
    set(listIdAtom, list.id)
    set(itemsAtom, list.items)
    set(listIsLoadedAtom, true)
})

export const updateItemAtom = atom(null, (get, set, updatedItem: Item) => {
    const items = get(itemsAtom)
    const newItems = items.map(it => it.id == updatedItem.id ? updatedItem : it)
    set(itemsAtom, newItems)
})

export const checkItemAtom = atom(null, async (get, set, id: number) => {
    const item = get(itemAtom)(id)
    const checkedItem = { ...item, checked: !item.checked }
    const newItems = get(itemsAtom).map(it => it.id == id ? checkedItem : it)
    await client.CheckItem(id)
    set(itemsAtom, newItems)
})

type PostItemParams = { listId: number, id: number } | { listId: number, name: string }

const postItem = async (args: PostItemParams): Promise<{ item: Item, product?: Product }> => {
    const { listId } = args
    let item = {} as Item
    let product
    if ('id' in args) {
        const resp = await client.PostItem(listId, args.id)
        item = { id: resp.id, checked: false, productId: args.id }
    } else {
        const resp = await client.PostItemByName(listId, { name: args.name })
        item = respToItem(resp)
        product = { id: item.productId, name: args.name } as Product
    }
    return { item: item, product: product }
}

export const postItemAtom = atom(null, async (get, set, args: { id: number } | { name: string }) => {
    const { item, product } = await postItem({ listId: get(listIdAtom), ...args })
    if (product) {
        set(productsAtom, [...get(productsAtom), product])
    }
    const itemProductName = get(productsAtom).find(p => p.id == item.productId)!.name
    item.productName = itemProductName
    const newItems = [...get(itemsAtom), item]
    set(itemsAtom, newItems)

})

export const deleteItemAtom = atom(null, async (get, set, id: number) => {
    await client.DeleteItem(id)
    const newItems = get(itemsAtom).filter(it => it.id != id)
    set(itemsAtom, newItems)
})


const getProducts = async (): Promise<Product[]> => {
    const resp = await client.ListProducts()
    return resp.products.map(p => ({
        id: p.id,
        name: p.name,
    }))
}


export const fetchProducts = atom(null, async (get, set) => {
    if (get(productIsLoadedAtom)) return
    const products = await getProducts()
    set(productsAtom, products)
    set(productIsLoadedAtom, true)
})

export const deleteListAtom = atom(null, async (get, set, force: boolean) => {
    try {
        const listId = get(listIdAtom)
        await client.DeleteList(listId, { Force: force })
        set(listIsLoadedAtom, false)
        return true
    } catch {
        return false
    }

})