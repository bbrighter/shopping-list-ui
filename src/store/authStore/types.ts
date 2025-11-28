import type { entity } from '../../api/generatedApi'

export type ProductInstance = {
    id: string
    productName: string
    productId: string
    selected: boolean
    url: string
}

export const respToProductInstances = (resp: entity.AuthData): Array<ProductInstance> => {
    return resp.instances.map(i => {
        return {
            id: i.piid,
            productId: i.product,
            productName: productMap[i.product as ProductKey].name,
            url: productMap[i.product as ProductKey].url,
            selected: false,
        }
    })
}

type ProductKey = 'shopping-list' | 'hista-complete'

const productMap: Record<ProductKey, { name: string, url: string }> = {
    'shopping-list': { name: 'Einkaufsliste', url: 'https://shopping-list-ui.vercel.app' },
    'hista-complete': { name: 'Hista', url: 'https://hista-ui.vercel.app' },
} as const



export type User = {
    id: string
    name: string
}