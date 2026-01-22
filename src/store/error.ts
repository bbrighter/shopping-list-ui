import { toast } from 'sonner'

import { isAPIError } from '../api/generatedApi'

export const handleException = (e: unknown, method: string) => {
    let showError = false
    if (isAPIError(e)) {
        switch (e.status) {
            case 404:
                return
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
        }
    }
}
