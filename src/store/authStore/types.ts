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
            url: productMap[i.product as ProductKey].url(),
            selected: false,
        }
    })
}

type ProductKey = 'shopping-list' | 'hista-complete'

const localOrProdUrl = (prodUrl: string) => {
    const hostname = new URL(window.location.href).host
    const isLocal = hostname.includes('localhost')
    return isLocal ? 'http://localhost:5173' : prodUrl
}

const productMap: Record<ProductKey, { name: string, url: () => string }> = {
    'shopping-list': { name: 'Einkaufsliste', url: () => localOrProdUrl('https://shopping-list-ui.vercel.app') },
    'hista-complete': { name: 'Hista', url: () => localOrProdUrl('https://hista-ui.vercel.app') },
} as const



export type User = {
    id: string
    name: string
}