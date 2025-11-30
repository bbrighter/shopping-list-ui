import { atom } from 'jotai';
import { locationAtom, productInstancesAtom, userAtom } from './atoms';

export const piidAtom = atom((get) => {
    const selectedInstance = get(selectedProductInstanceAtom)
    return selectedInstance?.id
})

export const userNameAtom = atom((get) => (get(userAtom)?.name))

const urlPiidAtom = atom((get) => {
    const location = get(locationAtom)
    const urlId = location.pathname?.split('/')[1]
    if (isGuid(urlId)) {
        return urlId
    }
    if (urlId == 'login') {
        return location.searchParams?.get('piid')
    }
})

export const selectedProductInstanceAtom = atom((get) => {
    const instances = get(productInstancesAtom)

    let instance = instances[0]
    const urlPiid = get(urlPiidAtom)
    if (urlPiid) {
        instance = instances.find(i => i.id == urlPiid) || instance
    } else {
        instance = instances.find(i => i.productId == 'shopping-list') || instance
    }
    return instance
})

const isGuid = (testString: string | undefined): boolean => {
    const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    return testString != undefined && guidRegex.test(testString)
}