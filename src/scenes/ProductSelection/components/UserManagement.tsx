import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import UserInvite from './UserInvite';
import UserList from './UserList';
import { MenuItem } from '@mui/material';
import { useState } from 'react';

export default function UserManagement() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <MenuItem onClick={() => setOpen(true)}>Benutzer</MenuItem>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{
                    width: '80%', bgcolor: 'background.paper', position: 'absolute',
                    maxWidth: '750px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                }}>
                    <Typography variant='h4'>Benutzer</Typography>
                    <UserList />
                    <UserInvite />
                </Box>
            </Modal>
        </>
    )
}