import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useAtomValue, useSetAtom } from 'jotai';
import { logoutAtom, tokenAtom } from '../../../store/authStore';

export function LogoutMenuEntry() {
    const logout = useSetAtom(logoutAtom)
    const token = useAtomValue(tokenAtom)

    return (
        <MenuItem onClick={logout} disabled={token == ''}>
            <ListItemIcon>
                <Logout />
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
        </MenuItem>
    )
}