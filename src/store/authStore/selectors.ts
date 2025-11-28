import { atom } from 'jotai';
import { selectedProductInstanceAtom, userAtom } from './atoms';

export const piidAtom = atom((get) => {
    const selectedInstance = get(selectedProductInstanceAtom)
    return selectedInstance?.id
})

export const userNameAtom = atom((get) => (get(userAtom)?.name))