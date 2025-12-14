import Menu from '@mui/material/Menu';
import { useState } from 'react';
import { LogoutMenuEntry } from './LogoutMenuEntry';
import ProductSelection from './ProductSelection';
import UserManagement from './UserManagementButton';
import { useUserName } from '@bbrighter/auth-module/authentication';
import { UserAvatar } from '@bbrighter/auth-module/user';



export function ProductMenu() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const open = Boolean(anchor)
    const userName = useUserName()

    const handleClose = () => setAnchor(null)
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => { setAnchor(e.currentTarget) }


    return (
        <>
            <UserAvatar
                onClick={handleClick}
                userName={userName}
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