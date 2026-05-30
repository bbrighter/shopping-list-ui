import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getDefaultStore } from 'jotai'
import type { Store } from 'jotai/vanilla/store'
import { beforeEach, describe, expect, it } from 'vitest'

import { itemsAtom } from '../../../store/items/atoms'
import { productsAtom } from '../../../store/products/atoms'
import { ItemInput } from './ItemInput'

describe('Item input for shopping list', () => {
    let store: Store

    beforeEach(() => {
        store = getDefaultStore()
        store.set(itemsAtom, [
            { id: 1, productId: 1, checked: true },
        ])
        store.set(productsAtom, [
            { id: 1, name: 'prod1', archived: false },
            { id: 2, name: 'prod2', archived: false },
            { id: 3, name: 'archived', archived: true },
        ])
    })

    it('render', async () => {
        render(<ItemInput />)

        const combobox = await screen.findByRole('combobox')
        await userEvent.click(combobox)

        expect(screen.getByText('prod2')).toBeInTheDocument()
        expect(screen.queryByText('prod1')).not.toBeInTheDocument()
        expect(screen.queryByText('archived')).not.toBeInTheDocument()
    })
})
