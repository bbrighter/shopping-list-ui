import { atom } from 'jotai';
import type { User } from './types';

export const userAtom = atom<User | undefined>()

