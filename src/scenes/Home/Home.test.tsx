import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { describe, expect, it, vi } from 'vitest'

import { server } from '../../__tests__/setupTest'
import { api } from '../../api/api'
import { type APIError, ErrCode } from '../../api/api'
import { piidAtom } from '../../store/atoms.app'
import Home from './Home'

const findListItem = async (name: string) => {
    const prod = await screen.findByText(name)
    expect(prod).toBeInTheDocument()
    const listItem = prod.closest('li')
    expect(listItem).toBeInTheDocument()
    return listItem!
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HydrateAtoms = ({ initialValues, children }: { initialValues: any, children: ReactNode }) => {
    useHydrateAtoms(initialValues)
    return children
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TestProvider = ({ initialValues, children }: { initialValues: any, children: ReactNode }) => (
    <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
)

const HomeProvider = () => {
    return (
        <TestProvider initialValues={[[piidAtom, '68a06340-c811-4820-bb18-fbe750f24f4a']]}>
            <Toaster />
            <Home />
        </TestProvider>
    )
}

describe('home page', () => {
    it('Renders', async () => {
        render(<HomeProvider />)

        const listItem1 = await findListItem('prod1')
        expect(within(listItem1).getByText('3')).toBeInTheDocument()
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('Check and uncheck', async () => {
        render(<HomeProvider />)

        const listItem1 = await findListItem('prod1')
        const checkboxProd1 = within(listItem1).getByRole('checkbox')
        expect(checkboxProd1).toBeInTheDocument()
        expect(checkboxProd1).not.toBeChecked()

        const listItem2 = await findListItem('prod2')
        const checkboxProd2 = within(listItem2).getByRole('checkbox')
        expect(checkboxProd2).toBeInTheDocument()
        expect(checkboxProd2).toBeChecked()

        await waitFor(() => {
            userEvent.click(checkboxProd2)
            expect(checkboxProd2).not.toBeChecked()
        })

        await waitFor(() => {
            userEvent.click(checkboxProd2)
            expect(checkboxProd2).toBeChecked()
        })
    })

    it('Edit quantity', async () => {
        render(<HomeProvider />)

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

    it('Delete', { skip: true }, async () => {
        // No idea how to test this with swiping only!
        render(<HomeProvider />)

        const listItem1 = await findListItem('prod1')
        const deleteButton = within(listItem1).getByTestId('deleteItem')

        await waitFor(async () => {
            await userEvent.click(deleteButton)
            expect(screen.queryByText('prod1')).not.toBeInTheDocument()
            expect(screen.getByText('prod2')).toBeInTheDocument()
        })
    })

    it('Create new item by name', async () => {
        const spy = vi.spyOn(api, 'PutItemByName')
        render(<HomeProvider />)

        const combobox = await screen.findByRole('combobox')
        await userEvent.type(combobox, 'new item')
        await userEvent.keyboard('{Enter}')

        const newItem = await screen.findByText('new item')
        expect(newItem).toBeInTheDocument()
        expect(newItem.closest('li')).toBeInTheDocument()

        expect(spy).toHaveBeenCalledWith('68a06340-c811-4820-bb18-fbe750f24f4a', 2, { name: 'new item' })
    })

    it('Create existing item again shows error', async () => {
        const spy = vi.spyOn(api, 'PutItemByName')
        render(<HomeProvider />)

        const combobox = await screen.findByRole('combobox')
        await userEvent.type(combobox, 'prod1')
        await userEvent.keyboard('{Enter}')

        expect(screen.getByText('prod1 steht schon in der Liste')).toBeInTheDocument()

        expect(spy).not.toHaveBeenCalled()
    })

    it('Create item based on existing product', async () => {
        const spy = vi.spyOn(api, 'PostItem')
        render(<HomeProvider />)

        const combobox = await screen.findByRole('combobox')
        await userEvent.type(combobox, 'prod')
        const option = screen.getByText('prod3')
        await userEvent.click(option)

        const newItem = await screen.findByText('prod3')
        expect(newItem).toBeInTheDocument()
        expect(newItem.closest('li')).toBeInTheDocument()

        expect(spy).toHaveBeenCalledWith('68a06340-c811-4820-bb18-fbe750f24f4a', 2, 3)
    })

    // it('Delete list', async () => {
    //     const spy = vi.spyOn(api, 'PostList')
    //     render(<HomeProvider />)

    //     const finishListButton = await screen.findByText('Liste abschließen')
    //     await userEvent.click(finishListButton)

    //     expect(await screen.findByRole('dialog')).toBeVisible()
    //     const keepButton = screen.getByText('Behalten')

    //     await userEvent.click(keepButton)
    //     expect(screen.getByRole('dialog')).not.toBeVisible()

    //     await userEvent.click(finishListButton)
    //     const deleteButton = await screen.findByText('Dennoch löschen')
    //     await userEvent.click(deleteButton)
    //     expect(await screen.findByRole('dialog')).not.toBeVisible()
    //     expect(spy).toHaveBeenCalledOnce()
    // })

    it('patch quantity', async () => {
        render(<HomeProvider />)

        const listItem2 = await findListItem('prod2')
        const plusButton = within(listItem2).getByText('+')
        expect(plusButton).toBeInTheDocument()
        const minusButton = within(listItem2).getByText('-')
        expect(minusButton).toBeInTheDocument()
        expect(minusButton).toBeDisabled()

        await waitFor(() => {
            userEvent.click(plusButton)
            expect(within(listItem2).getByText('1')).toBeInTheDocument()
        })

        await waitFor(() => {
            expect(minusButton).not.toBeDisabled()
            userEvent.click(minusButton)
            expect(within(listItem2).queryByText('1')).not.toBeInTheDocument()
        })
    })

    it('error toast is shown', async () => {
        // Need to mock pointer capture events for this test
        HTMLElement.prototype.setPointerCapture = () => {}
        HTMLElement.prototype.releasePointerCapture = () => {}

        userEvent.setup()
        server.use(http.get('/piid/:piid/moments', () => HttpResponse.json({ status: 400, code: ErrCode.InvalidArgument, name: 'name', message: 'msg' } satisfies APIError, { status: 400 })))

        render(<HomeProvider />)

        const toast = (await screen.findByText(/Fehler mit Statuscode/)).closest('li')!
        expect(toast).toBeInTheDocument()
        expect(within(toast).getByText('msg')).toBeInTheDocument()

        const copyButton = within(toast).getByText('Kopieren')
        expect(copyButton).toBeInTheDocument()
        await userEvent.click(copyButton)

        const clipboardText = await navigator.clipboard.readText()
        expect(clipboardText).toContain('Fehler mit Statuscode 400 bei: Moments')
    })

    it('empty list placeholder is shown', async () => {
        server.use(http.post('/piid/:piid/list', () => (HttpResponse.json({ id: 1, items: [] }))))

        render(<HomeProvider />)

        const img = await screen.findByRole('img')
        expect(img).toBeInTheDocument()
    })
})
