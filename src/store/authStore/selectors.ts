import { atom } from 'jotai';
import { userAtom } from './atoms';



export const userNameAtom = atom((get) => (get(userAtom)?.name))


