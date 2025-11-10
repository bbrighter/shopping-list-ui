import { atom } from 'jotai'
import type { Item } from './types'

export const listIdAtom = atom(0)
export const itemsAtom = atom<Array<Item>>([])
export const listIsLoadedAtom = atom(false)
