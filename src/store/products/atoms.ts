import { atom } from "jotai";

import type { Product } from "./types";

export const productsVersionAtom = atom<number | undefined>();
export const productsLoadedAtom = atom(false);
export const productsAtom = atom<Array<Product>>([]);

export const isManagementOpen = atom(false);
