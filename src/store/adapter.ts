import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, authApiAtom, userNameAtom, productInstancesAtom, productKeyAtom, usersAtom, userApiAtom, piidAtom } from './atoms';
import { useLocation as useLocationWouter } from 'wouter';
import type { AuthStateAdapter } from '@bbrighter/auth-module/auth';
import type { UserStateAdapter } from '@bbrighter/auth-module/users';


export const useAuthStateAdapter = (): AuthStateAdapter => {
    const [token, setToken] =  useAtom(tokenAtom)
    const useToken = () => ({ token, setToken })
    const useAuthApi = () => (useAtomValue(authApiAtom))
    const [userName, setUserName] = useAtom(userNameAtom)
    const useUserName = () => ({ userName, setUserName })
    const [instances, setInstances] = useAtom(productInstancesAtom)
    const useProductInstances = () => ({  instances, setInstances })
    const useProductKey = () => (useAtomValue(productKeyAtom))
    const [location, navigate] = useLocationWouter()
    const useLocation = () => ({ location, navigate })

    return { useToken, useAuthApi, useUserName, useProductInstances, useProductKey, useLocation }
}


export const useUserManagementAdapter = (): UserStateAdapter => {
    const [users, setUsers] = useAtom(usersAtom)
    const useUsers = () => ({ users, setUsers })
    const useApi = () => (useAtomValue(userApiAtom))
    const usePiid = () => (useAtomValue(piidAtom))

    return { useUsers, useApi, usePiid }
} 