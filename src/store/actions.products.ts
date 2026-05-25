import { atom } from 'jotai'

import { api } from '../api/api'
import { apiWrapper } from './apiWrapper'
import { piidAtom } from './atoms.app'
import { productsAtom, productsLoadedAtom } from './products/atoms'
import { respToProducts } from './products/types'

export const fetchProductsAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    if (!piid) return

    const promise = api.GetProducts(piid)
    const resp = await apiWrapper(promise, { methodName: 'Produkte holen' })
    if (!resp.ok) return

    const products = respToProducts(resp.resp)
    set(productsAtom, products)
    set(productsLoadedAtom, true)
})
