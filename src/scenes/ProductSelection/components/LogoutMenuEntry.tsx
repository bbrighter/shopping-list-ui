import { useToken } from '@bbrighter/auth-module';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';


export function LogoutMenuEntry() {
    const token = useToken()
    const logout = () => { }

    return (
        <MenuItem onClick={logout} disabled={token == ''}>
            <ListItemIcon>
                <Logout />
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
        </MenuItem>
    )
}