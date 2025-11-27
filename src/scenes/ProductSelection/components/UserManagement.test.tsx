import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UserManagement from './UserManagement';
import userEvent from '@testing-library/user-event';

describe('user management', () => {
    it('show and invite users', async () => {
        render(<UserManagement />)

        const userMenuButton = await screen.findByText('Benutzer')
        await userEvent.click(userMenuButton)

        expect(screen.getByText('Nutzerverwaltung')).toBeInTheDocument()
        const inviteTextField = screen.getByLabelText('Nutzer einladen')
        expect(screen.getByText('user 1')).toBeInTheDocument()

        await userEvent.type(inviteTextField, 'user 2')
        const inviteButton = screen.getByText('Einladen')
        await userEvent.click(inviteButton)
        expect(screen.getByText('user 2')).toBeInTheDocument()
    })
})