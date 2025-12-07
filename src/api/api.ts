/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Client, { Environment, Local, type ClientOptions } from './generatedApi';
import { fetcher } from './fetcher';
import { piid } from '@bbrighter/auth-module';



const getStageURL = (): string => {
    const hostname = new URL(window.location.href).hostname
    if (hostname.includes('shopping-list-ui-git')) {
        return Environment('staging')
    } else {
        return Environment('prod')
    }
}

const baseUrl = import.meta.env.MODE === 'test'
    ? 'http://localhost:4444'
    : import.meta.env.PROD
        ? getStageURL()
        : Local


const options: ClientOptions = {
    fetcher: fetcher,
    auth: () => ({ Token: window.localStorage.getItem('new-token') || '' }),
}


const baseClient = new Client(baseUrl, options)
export const authApi = baseClient.authentication




type DropFirstArg<F> = F extends (first: any, ...rest: infer R) => infer Ret
    ? (...args: R) => Ret
    : F

type PiidInjectedClient<T> = {
    [K in keyof T]: DropFirstArg<T[K]>
}



export const client: PiidInjectedClient<typeof baseClient.shoppinglist> = new Proxy(baseClient.shoppinglist, {
    get(target, prop, receiver) {
        const orig = Reflect.get(target, prop, receiver)
        if (typeof orig !== 'function') {
            return orig
        }

        return (...args: any[]) => {
            const pi_id = piid()
            if (!pi_id) {
                // eslint-disable-next-line no-console
                console.warn('no piid injected')
                return
            }
            return orig.call(target, pi_id, ...args)
        }
    },
}) as any



export const authClient: PiidInjectedClient<typeof baseClient.authentication> = new Proxy(baseClient.authentication, {
    get(target, prop, receiver) {
        const orig = Reflect.get(target, prop, receiver)

        if (typeof orig !== 'function') {
            return orig
        }

        return (...args: any[]) => {
            const pi_id = piid?.()
            if (!pi_id) {
                // eslint-disable-next-line no-console
                console.warn('no piid injected')
                return
            }
            return orig.call(target, pi_id, ...args)
        }
    },
}) as any
