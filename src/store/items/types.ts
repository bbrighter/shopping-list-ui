import type { shoppinglist } from '../../api/api'

export type Item = {
    id: number
    checked: boolean
    productId: number
    quantity?: number | null
}

export const respToItem = (resp: shoppinglist.ItemResponse): Item => {
    return {
        id: resp.id,
        checked: resp.checked,
        productId: resp.productId,
        quantity: resp.quantity,
    }
}

export const respToList = (resp: shoppinglist.ListResponse): { listId: number, items: Array<Item> } => {
    if (!resp) {
        return { listId: 0, items: [] }
    }
    const listId = resp.id
    const items = resp.items.map(it => respToItem(it))
    return { listId, items }
}
