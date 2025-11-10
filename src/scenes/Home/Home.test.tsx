import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';

const findListItem = async (name: string) => {
    const prod = await screen.findByText(name)
    expect(prod).toBeInTheDocument()
    const listItem = prod.closest('li')
    expect(listItem).toBeInTheDocument()
    return listItem!
}

describe('home page', () => {
    it('Renders', async () => {
        render(<Home />)

        const listItem1 = await findListItem('prod1')
        expect(within(listItem1).getByText('3')).toBeInTheDocument()
    })

    it('Check and uncheck', async () => {
        render(<Home />)

        const listItem1 = await findListItem('prod1')
        const checkboxProd1 = within(listItem1).getByRole('checkbox')
        expect(checkboxProd1).toBeInTheDocument()
        expect(checkboxProd1).not.toBeChecked()

        const listItem2 = await findListItem('prod2')
        const checkboxProd2 = within(listItem2).getByRole('checkbox')
        expect(checkboxProd2).toBeInTheDocument()
        expect(checkboxProd2).toBeChecked()

        await userEvent.click(checkboxProd2)
        expect(checkboxProd2).not.toBeChecked()
        await userEvent.click(checkboxProd2)
        expect(checkboxProd2).toBeChecked()

    })

    it('Edit quantity', async () => {
        render(<Home />)

        const listItem1 = await findListItem('prod1')
        expect(within(listItem1).getByText('3')).toBeInTheDocument()

        const increaseButton = within(listItem1).getByTestId('increaseItemQuantity')
        expect(increaseButton).toBeInTheDocument()
        await userEvent.click(increaseButton)
        expect(within(listItem1).getByText('4')).toBeInTheDocument()

        const decreaseButton = within(listItem1).getByTestId('decreaseItemQuantity')
        expect(decreaseButton).toBeInTheDocument()
        await userEvent.click(decreaseButton)
        expect(within(listItem1).getByText('3')).toBeInTheDocument()
    })

    it('Delete', async () => {
        render(<Home />)

        const listItem1 = await findListItem('prod1')
        const deleteButton = within(listItem1).getByTestId('deleteItem')
        await userEvent.click(deleteButton)

        expect(screen.queryByText('prod1')).not.toBeInTheDocument()
        expect(screen.getByText('prod2')).toBeInTheDocument()
    })

    it('Create new', { skip: true }, async () => {
        render(<Home />)
    })
})
