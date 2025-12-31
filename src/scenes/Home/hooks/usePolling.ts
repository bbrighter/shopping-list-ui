import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'

import { pollingStateAtom } from '../../../store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePolling = (callback: () => Promise<void>, interval: number, deps: Array<any>) => {
    const resetPolling = useAtomValue(pollingStateAtom)
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        let id: number | null
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
    }, [resetPolling, interval, ...deps])
}

export default usePolling
