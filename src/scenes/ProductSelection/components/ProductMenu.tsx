import Menu from '@mui/material/Menu';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { LogoutMenuEntry } from './LogoutMenuEntry';
import { useCurrentUserAvatar } from '../hooks/useUserAvatar';
import UserManagement from './UserManagement';
import ProductSelection from './ProductSelection';


export function ProductMenu() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const open = Boolean(anchor)

    const props = useCurrentUserAvatar()

    const handleClose = () => setAnchor(null)
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => { setAnchor(e.currentTarget) }


    return (
        <>
            <Avatar
                onClick={handleClick}
                {...props}
            />
            <Menu
                open={open}
                anchorEl={anchor}
                onClose={handleClose}
            >
                <ProductSelection />
                <UserManagement />
                <LogoutMenuEntry />
            </Menu>
        </>


    )
}