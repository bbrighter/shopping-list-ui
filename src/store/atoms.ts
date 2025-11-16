import { atom } from 'jotai'
import type { Item, Product } from './types'

export const listIdAtom = atom(0)
export const itemsAtom = atom<Array<Item>>([])
export const productsAtom = atom<Array<Product>>([])
export const etagAtom = atom('')
