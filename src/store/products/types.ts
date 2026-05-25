import type { shoppinglist } from '../../api/api'

export type Product = {
    id: number
    name: string
    archived: boolean
}

export const respToProducts = (resp: shoppinglist.ProductListResponse): Array<Product> => (
    resp.products.map(p => ({ id: p.id, name: p.name, archived: p.archived }))
)
