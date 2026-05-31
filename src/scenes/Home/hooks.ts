import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { fetchItemsAtom } from '../../store/actions.items'
import { fetchProductsAtom } from '../../store/actions.products'
import { piidAtom } from '../../store/atoms.app'
import { itemsVersionAtom, resetPollingAtom } from '../../store/items/atoms'
import { productsVersionAtom } from '../../store/products/atoms'

export const useItemGetter = () => {
    const piid = useAtomValue(piidAtom)
    const itemsVersion = useAtomValue(itemsVersionAtom)
    const getItems = useSetAtom(fetchItemsAtom)

    useEffect(() => {
        getItems()
    }, [itemsVersion, piid, getItems])
}

export const useProductGetter = () => {
    const piid = useAtomValue(piidAtom)
    const productsVersion = useAtomValue(productsVersionAtom)
    const getProducts = useSetAtom(fetchProductsAtom)

    useEffect(() => {
        getProducts()
    }, [productsVersion, piid, getProducts])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePolling = (callback: () => Promise<void>, interval: number, deps: Array<any>) => {
    const resetPolling = useAtomValue(resetPollingAtom)
    const callbackRef = useRef(callback)
    const piid = useAtomValue(piidAtom)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        let id: NodeJS.Timeout | null
        const tick = () => callbackRef.current()

        const handleVisibilityChange = () => {
            if (document.visibilityState == 'visible') {
                if (resetPolling == 0) tick()
                id = setInterval(tick, interval)
            }
            else if (id) {
                clearInterval(id)
                id = null
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        handleVisibilityChange()

        return () => {
            if (id) clearInterval(id)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetPolling, piid, interval, ...deps])
}

export default usePolling
