export const AUTH_EVENT_NAME = 'Auth'

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
    const resp = await fetch(input, init)
    if (resp.status == 401) {
        const path = window.location.pathname
        window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: path }))
    }
    return resp
}