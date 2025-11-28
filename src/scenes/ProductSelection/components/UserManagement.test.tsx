import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import UserManagement from './UserManagement';
import userEvent from '@testing-library/user-event';
import { getDefaultStore } from 'jotai';
import { getPermissionsAtom } from '../../../store/authStore';

describe('user management', () => {
    beforeEach(() => {
        const store = getDefaultStore()
        store.set(getPermissionsAtom)
    })

    it('show and invite users', async () => {
        render(<UserManagement />)

        const userMenuButton = await screen.findByText('Benutzer')
        await userEvent.click(userMenuButton)

        expect(screen.getByText('Nutzerverwaltung')).toBeInTheDocument()
        const inviteTextField = screen.getByLabelText('Nutzer einladen')
        expect(screen.getByText('user 1')).toBeInTheDocument()
        const deleteUser1 = screen.getByTestId('deleteUser')
        expect(deleteUser1).toBeInTheDocument()
        expect(deleteUser1).toBeDisabled()

        await userEvent.type(inviteTextField, 'user 2')
        expect((inviteTextField as HTMLInputElement).value).toBe('user 2')
        const inviteButton = screen.getByText('Einladen')
        await userEvent.click(inviteButton)
        expect(screen.getByText('user 2')).toBeInTheDocument()
        expect((inviteTextField as HTMLInputElement).value).toBe('') // Value cleared after successful invite
    })

    it('error on invite', { skip: true }, () => {

    })
})