import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, authApiAtom, userNameAtom, productInstancesAtom, productKeyAtom, usersAtom, userApiAtom, piidAtom } from './atoms';
import { type AuthStateAdapter, type UserStateAdapter } from '@bbrighter/auth-module'
import { useLocation as useLocationWouter } from 'wouter';


export const useAuthStateAdapter = (): AuthStateAdapter => {
    const useToken = () => (useAtom(tokenAtom))
    const useAuthApi = () => (useAtom(authApiAtom))
    const useUserName = () => (useAtom(userNameAtom))
    const useProductInstances = () => (useAtom(productInstancesAtom))
    const useProductKey = () => (useAtom(productKeyAtom))
    const useLocation = () => (useLocationWouter())

    return { useToken, useAuthApi, useUserName, useProductInstances, useProductKey, useLocation }
}


export const useUserManagementAdapter = (): UserStateAdapter => {
    const useUsers = () => (useAtom(usersAtom))
    const useApi = () => (useAtomValue(userApiAtom))
    const usePiid = () => (useAtomValue(piidAtom))

    return { useUsers, useApi, usePiid }
} 