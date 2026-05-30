export * from './actions.items'
export * from './actions.moments'
export * from './actions.products'
import * as itemAtoms from './items/atoms'
import { isManagementOpen } from './products/atoms'
import * as s from './selectors'

export const atoms = {
    items: itemAtoms,
    products: { isManagementOpen },
}

export const selectors = {
    items: {
        withNames: s.itemsWithNamesAtom,
    },
    products: {
        sorted: s.sortedProductsAtom,
        nonArchived: s.nonArchivedProductsAtom,
    },
}
