import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePolling = (callback: () => Promise<void>, interval: number, deps: Array<any>) => {
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    useEffect(() => {
        let id: number | null
        const tick = () => callbackRef.current()

        const handleVisibilityChange = () => {
            if (document.visibilityState == 'visible') {
                tick()
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
    }, deps)
}

export default usePolling
