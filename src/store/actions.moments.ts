import { atom } from 'jotai'

import { api } from '../api/api'
import { apiWrapper } from './apiWrapper'
import { piidAtom } from './atoms.app'
import { itemsVersionAtom } from './items/atoms'
import { productsVersionAtom } from './products/atoms'

export const fetchMomentsAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    if (!piid) return

    const resp = await apiWrapper(api.GetMoments(piid), { methodName: 'Moments' })
    if (!resp.ok) return

    const itemVersion = get(itemsVersionAtom)
    if (resp.resp.itemsVersion !== itemVersion) {
        set(itemsVersionAtom, resp.resp.itemsVersion)
    }
    const productVersion = get(productsVersionAtom)
    if (resp.resp.productsVersion !== productVersion) {
        set(productsVersionAtom, resp.resp.productsVersion)
    }
})
