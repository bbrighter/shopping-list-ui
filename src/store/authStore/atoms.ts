import { atom } from 'jotai';
import type { ProductInstance, User } from './types';
import { atomWithStorage } from 'jotai/utils';

const storage = {
    getItem: (key: string, initialVal: string) => { return window.localStorage.getItem(key) || initialVal },
    setItem: (key: string, val: string) => { window.localStorage.setItem(key, val) },
    removeItem: (key: string) => { window.localStorage.removeItem(key) },
}

export const productInstancesAtom = atom<Array<ProductInstance>>([])
export const tokenAtom = atomWithStorage('new-token', '', storage)
export const selectedProductInstanceAtom = atom<ProductInstance | undefined>()
export const authProblemAtom = atom(true)
export const userAtom = atom<User | undefined>()
export const usersAtom = atom<Array<User>>([])

