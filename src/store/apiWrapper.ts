import { toast } from 'sonner'

import { isAPIError } from '../api/api'

type ApiWrapperOptions = {
    loadingDelayMs?: number
    methodName?: string
    supressStatusCodes?: Array<number>
}

type ApiReponse<T> = { ok: true, resp: T } | { ok: false, statusCode: number }

export const apiWrapper = async <T>(promise: Promise<T>, { loadingDelayMs = 1000, methodName = 'Api call', supressStatusCodes = [] }: ApiWrapperOptions): Promise<ApiReponse<T>> => {
    let loadingToastId: null | string | number = null

    const timer = setTimeout(() => {
        loadingToastId = toast.loading('Laden dauert länger als erwartet', { description: `${methodName}` })
    }, loadingDelayMs)

    try {
        return { ok: true, resp: await promise }
    }
    catch (e) {
        return { ok: false, statusCode: handleException(e, methodName, supressStatusCodes) }
    }
    finally {
        clearTimeout(timer)
        if (loadingToastId) {
            toast.dismiss(loadingToastId)
        }
    }
}

const handleException = (e: unknown, method: string, supressStatusCodes?: Array<number>): number => {
    let showError = false
    if (isAPIError(e)) {
        if (supressStatusCodes?.includes(e.status)) {
            return e.status
        }
        switch (e.status) {
            case 404:
                return 404
            default:
                showError = true
        }
        if (showError) {
            const title = `Fehler mit Statuscode ${e.status} bei: ${method}`
            const details = `${title} \n ${e.message} \n ${e.details} \n ${e.stack}`
            toast.error(
                title,
                {
                    description: e.message,
                    closeButton: true,
                    duration: 20_000,
                    action: {
                        label: 'Kopieren',
                        onClick: () => navigator.clipboard.writeText(details),
                    },
                },
            )
            return e.status
        }
    }
    return 500
}
