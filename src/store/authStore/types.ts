import type { entity } from '../../api/generatedApi'

export type ProductInstance = {
    id: string
    productName: string
    productId: string
    selected: boolean
}

export const respToProductInstances = (resp: entity.AuthData): Array<ProductInstance> => {
    return resp.instances.map(i => {
        return {
            id: i.piid,
            productId: i.product,
            productName: productIdToName(i.product),
            selected: false,
        }
    })
}

const idMap = new Map()
idMap.set('shopping-list', 'Einkaufsliste')
idMap.set('hista-complete', 'Hista')

const productIdToName = (id: string): string => {
    return idMap.get(id)
}


export type User = {
    id: string
    name: string
}