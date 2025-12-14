import { atom } from 'jotai'
import type { Item, Product } from './types'
import { authApi } from '../api/api'
import { atomWithStorage } from 'jotai/utils'
import type { AuthApi } from '@bbrighter/auth-module/authentication'
import type { UserAPI } from '@bbrighter/auth-module/user-management'

type ProductKey = 'shopping-list' | 'hista-complete'

type ProductInstance = {
    id: string
    productName: string
    productId: string
    url: string
}

type User = {
    id: string
    name: string
}

const storage = {
    getItem: (key: string, initialVal: string) => { return window.localStorage.getItem(key) || initialVal },
    setItem: (key: string, val: string) => { window.localStorage.setItem(key, val) },
    removeItem: (key: string) => { window.localStorage.removeItem(key) },
}

export const piidAtom = atom('')
export const listIdAtom = atom(0)
export const itemsAtom = atom<Array<Item>>([])
export const productsAtom = atom<Array<Product>>([])
export const etagAtom = atom('')
export const tokenAtom = atomWithStorage('new-token', '', storage)
export const authApiAtom = atom<AuthApi>(authApi)
export const userApiAtom = atom<UserAPI>(authApi)
export const userNameAtom = atom('')
export const productInstancesAtom = atom<Array<ProductInstance>>([])
export const productKeyAtom = atom<ProductKey>('shopping-list')
export const usersAtom = atom<Array<User>>([])