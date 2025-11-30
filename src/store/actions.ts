import { atom } from 'jotai'
import { etagAtom, itemsAtom, listIdAtom, productsAtom } from './atoms'
import { client } from '../api/api'
import { respToData, type Product } from './types'
import { itemAtom } from './selectors'
import { respToItem, type Item } from './types'
import { isAPIError } from '../api/generatedApi'

export const fetchDataAtom = atom(null, async (get, set) => {
    try {
        const ifNoneMatch = get(etagAtom)
        const resp = await client.GetMoments({ IfNoneMatch: ifNoneMatch })
        const { listId, items, products, etag } = respToData(resp)
        set(listIdAtom, listId)
        set(itemsAtom, items)
        set(productsAtom, products)
        set(etagAtom, etag)
    } catch (error) {
        if (isAPIError(error) && error.status == 304) {
            return
        }
        if (isAPIError(error) && error.status == 404) {
            const resp = await client.PostList()
            set(listIdAtom, resp.id)
        }
        // eslint-disable-next-line no-console
        console.error('catch:', error)
    }

})

export const createListAtom = atom(null, async (_get, set) => {
    const resp = await client.PostList()
    set(listIdAtom, resp.id)
})

export const checkItemAtom = atom(null, async (get, set, id: number) => {
    const item = get(itemAtom)(id)
    const checkedItem = { ...item, checked: !item.checked }
    const newItems = get(itemsAtom).map(it => it.id == id ? checkedItem : it)
    await client.CheckItem(id)
    set(itemsAtom, newItems)
})

export const changeItemQuantityAtom = atom(null, async (get, set, id: number, newQuantity?: number) => {
    const item = get(itemAtom)(id)
    const newItem = { ...item, quantity: newQuantity }
    const newItems = get(itemsAtom).map(it => it.id == id ? newItem : it)
    await client.PatchItem(id, { quantity: newQuantity ?? 0 })
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



export const deleteListAtom = atom(null, async (get, _set, force: boolean) => {
    try {
        const listId = get(listIdAtom)
        await client.DeleteList(listId, { Force: force })
        return true
    } catch {
        return false
    }

})