import { atom } from 'jotai'

import { api } from '../api/api'
import { isAPIError } from '../api/generatedApi'
import { etagAtom, itemsAtom, listIdAtom, piidAtom, productsAtom } from './atoms'
import { itemAtom } from './selectors'
import { type Product, respToData } from './types'
import { type Item, respToItem } from './types'

export const fetchDataAtom = atom(null, async (get, set) => {
  const piid = get(piidAtom)
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
    }
    // eslint-disable-next-line no-console
    console.error('catch:', error)
  }
})

export const createListAtom = atom(null, async (get, set) => {
  const piid = get(piidAtom)
  const resp = await api.PostList(piid)
  set(listIdAtom, resp.id)
})

export const checkItemAtom = atom(null, async (get, set, id: number) => {
  const piid = get(piidAtom)
  const item = get(itemAtom)(id)
  const checkedItem = { ...item, checked: !item.checked }
  const newItems = get(itemsAtom).map(it => it.id == id ? checkedItem : it)
  await api.CheckItem(piid, id)
  set(itemsAtom, newItems)
})

export const changeItemQuantityAtom = atom(null, async (get, set, id: number, newQuantity?: number) => {
  const piid = get(piidAtom)
  const item = get(itemAtom)(id)
  const newItem = { ...item, quantity: newQuantity }
  const newItems = get(itemsAtom).map(it => it.id == id ? newItem : it)
  await api.PatchItem(piid, id, { quantity: newQuantity ?? 0 })
  set(itemsAtom, newItems)
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
    set(productsAtom, [...get(productsAtom), product])
  }
  const itemProductName = get(productsAtom).find(p => p.id == item.productId)!.name
  item.productName = itemProductName
  const newItems = [...get(itemsAtom), item]
  set(itemsAtom, newItems)
})

export const deleteItemAtom = atom(null, async (get, set, id: number) => {
  const piid = get(piidAtom)
  await api.DeleteItem(piid, id)
  const newItems = get(itemsAtom).filter(it => it.id != id)
  set(itemsAtom, newItems)
})

export const deleteListAtom = atom(null, async (get, _set, force: boolean) => {
  const piid = get(piidAtom)
  try {
    const listId = get(listIdAtom)
    await api.DeleteList(piid, listId, { Force: force })
    return true
  }
  catch {
    return false
  }
})
