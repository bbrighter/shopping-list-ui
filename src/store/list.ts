import { atom } from "jotai"
import { client } from "../api/api"
import type { entity } from "../api/generatedApi"
import { productsAtom } from "./products"

type Item = {
    id: number
    checked: boolean
    productId: number
    productName?: string
    quantity: number
}

type List = Array<Item>

const respToItems = (resp: entity.ListResponse): List => {
    return resp.items.map(it => ({
        id: it.id,
        checked: it.checked,
        productId: it.productId,
        quantity: it.quantity,
    }))
}

const getList = async () => {
    const resp = await client.GetOrCreateList()
    return respToItems(resp)
}

export const listAtom = atom<List>([])

export const fetchListAtom = atom(null, async (_get, set) => {
    const list = await getList()
    set(listAtom, list)
})


export const listWithProducts = atom((get) => {
    const list = get(listAtom)
    const products = get(productsAtom)
    return list.map(it => ({
        ...it,
        productName: products.find(p => p.id == it.productId)?.name
    }))
})