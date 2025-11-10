import { atomWithStorage } from 'jotai/utils';
import { authApi, injectPiidGetter } from '../api/api';
import { atom, getDefaultStore } from 'jotai';


const storage = {
    getItem: (key: string, initialVal: string) => { return window.localStorage.getItem(key) || initialVal },
    setItem: (key: string, val: string) => { window.localStorage.setItem(key, val) },
    removeItem: (key: string) => { window.localStorage.removeItem(key) },

}
export const tokenAtom = atomWithStorage('token', '', storage)


export const postLoginAtom = atom(null, async (_get, set, { password, userName }: { password: string, userName: string }): Promise<boolean> => {
    try {
        const resp = await authApi.Login({ password, userName })
        set(tokenAtom, resp.token)
        return true
    } catch {
        return false
    }
})

export const piidAtom = atom('')
const authProblemAtom = atom(true)

export const getPermissionsAtom = atom(null, async (get, set) => {
    if (get(authProblemAtom) || get(piidAtom) == '') {
        const resp = await authApi.GetPermissions()
        const piid = resp.instances.find(v => v.appMapping['shopping-list'])?.piid || ''
        set(piidAtom, piid)
        set(authProblemAtom, false)
    }
})


injectPiidGetter(() => getDefaultStore().get(piidAtom))