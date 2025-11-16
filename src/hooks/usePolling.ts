import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePolling = (callback: () => Promise<void>, interval: number, deps: Array<any>) => {

    useEffect(() => {
        callback()
        const id = setInterval(() => {
            callback()
        }, interval)

        return () => clearInterval(id)
    }, [deps])
}

export default usePolling