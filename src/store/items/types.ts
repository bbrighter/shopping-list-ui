import type { entity } from '../../api/generatedApi'

export type Item = {
    id: number
    checked: boolean
    productId: number
    productName?: string
    quantity?: number
}

export const respToItem = (resp: entity.ItemResponse): Item => {
    return {
        id: resp.id,
        checked: resp.checked,
        productId: resp.productId,
        quantity: resp.quantity,
    }
}

type List = { id: number, items: Array<Item> }

export const respToList = (resp: entity.ListResponse): List => (
    { id: resp.id, items: resp.items.map(it => respToItem(it)) }
)