import type { entity } from '../api/generatedApi'

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

export const respToData = (resp: entity.MomentsResponse): { listId: number, items: Array<Item>, products: Array<Product>, etag: string } => {
    if (!resp) {
        return { listId: 0, items: [], products: [], etag: '' }
    }
    const listId = resp.listId
    const items = resp.items.map(it => respToItem(it))
    const products = resp.products.map(p => respToProduct(p))
    const etag = resp.ETag
    return { listId, items, products, etag }
}

export type Product = {
    id: number
    name: string
}

const respToProduct = (resp: entity.ProductResponse): Product => (
    { id: resp.id, name: resp.name }
)
