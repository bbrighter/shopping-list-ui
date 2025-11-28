import { atom, getDefaultStore } from 'jotai'
import { authApi, injectPiidGetter } from '../../api/api'
import { authProblemAtom, productInstancesAtom, selectedProductInstanceAtom, tokenAtom, userAtom, usersAtom } from './atoms'
import { respToProductInstances, type User } from './types'
import { piidAtom } from './selectors'
import { APIError } from '../../api/generatedApi'

export const postLoginAtom = atom(null, async (_get, set, { password, userName }: { password: string, userName: string }): Promise<boolean> => {
    try {
        const resp = await authApi.Login({ password, userName })
        set(tokenAtom, resp.token)
        return true
    } catch {
        return false
    }
})

export const logoutAtom = atom(null, (_get, set) => {
    set(tokenAtom, '')
    set(userAtom, undefined)
})


export const getPermissionsAtom = atom(null, async (get, set) => {
    if (get(authProblemAtom)) {
        const resp = await authApi.GetPermissions()
        const instances = respToProductInstances(resp)
        set(productInstancesAtom, instances)
        const instanceIndex = instances.findIndex(i => i.productId == 'shopping-list')
        set(selectedProductInstanceAtom, instances[instanceIndex])
        instances.splice(instanceIndex, 1, { ...instances[instanceIndex], selected: true })
        set(productInstancesAtom, instances)
        set(authProblemAtom, false)
        set(userAtom, { id: resp.userId, name: resp.userName })
    }
})

export const getUsersAtom = atom(null, async (get, set) => {
    const piid = get(piidAtom)
    if (!piid) return
    const resp = await authApi.GetUsersForProductInstance(piid)
    const users: Array<User> = resp.users.map(u => ({ id: u.id, name: u.name }))
    set(usersAtom, users)
})

export const inviteUserAtom = atom(null, async (get, set, { userName }: { userName: string }) => {
    const piid = get(piidAtom)
    if (!piid) return
    try {
        const resp = await authApi.AddUserToProductInstance(piid, userName)
        const users = get(usersAtom)
        set(usersAtom, [...users, { id: resp.id, name: userName }])
    } catch (err: unknown) {
        if (err instanceof APIError && err.status == 404) {
            return 404
        }
    }

})

export const deleteUserAtom = atom(null, async (get, set, { userName }: { userName: string }) => {
    const piid = get(piidAtom)
    if (!piid) return
    await authApi.RemoveUserFromProductInstance(piid, userName)
    const updatedUsers = get(usersAtom).filter(u => u.name != userName)
    set(usersAtom, updatedUsers)
})


injectPiidGetter(() => getDefaultStore().get(piidAtom) || null)