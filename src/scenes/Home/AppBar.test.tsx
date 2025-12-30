import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import App from '../../App'

describe('app bar works with api', () => {
    it('renders', async () => {
        render(<App />)

        const avatar = await screen.findByText('U1')
        expect(avatar).toBeInTheDocument()

        await userEvent.click(avatar)
        expect(screen.getByText('Einkaufsliste')).toBeInTheDocument()
    })

    it('user management', async () => {
        render(<App />)

        const avatar = await screen.findByText('U1')
        expect(avatar).toBeInTheDocument()

        await userEvent.click(avatar)

        const userManagementButton = screen.getByText('Benutzer')
        expect(userManagementButton).toBeInTheDocument()
        await userEvent.click(userManagementButton)
        expect(screen.getByText('Nutzerverwaltung')).toBeInTheDocument()

        const inviteInputField = screen.getByLabelText('Nutzer einladen')
        expect(inviteInputField).toBeInTheDocument()
        await userEvent.type(inviteInputField, 'name')
        const inviteButton = screen.getByText('Einladen')
        expect(inviteButton).toBeInTheDocument()
        await userEvent.click(inviteButton)

        const newUserRow = screen.getByText('name').closest('li')!
        expect(newUserRow).toBeInTheDocument()
        const deleteNewUserButton = within(newUserRow).getByTestId('deleteUser')
        await userEvent.click(deleteNewUserButton)
        expect(screen.queryByText('name')).not.toBeInTheDocument()
    })

    it('Logout,  no token, hence disabled', async () => {
        window.localStorage.clear()
        render(<App />)

        const avatar = await screen.findByText('U1')
        expect(avatar).toBeInTheDocument()

        await userEvent.click(avatar)

        const logoutButton = screen.getByText('Logout').closest('li')!
        expect(logoutButton).toHaveAttribute('aria-disabled', 'true')
    })

    it('Logout', async () => {
        render(<App />)

        const avatar = await screen.findByText('U1')
        expect(avatar).toBeInTheDocument()

        await userEvent.click(avatar)

        const logoutButton = screen.getByText('Logout').closest('li')!
        expect(logoutButton).toBeInTheDocument()
        await userEvent.click(logoutButton)
    })
})
