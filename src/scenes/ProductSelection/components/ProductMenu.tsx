import Menu from '@mui/material/Menu';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { productInstancesAtom, selectedProductInstanceAtom, type ProductInstance } from '../../../store/authStore';
import Avatar from '@mui/material/Avatar';
import { LogoutMenuEntry } from './LogoutMenuEntry';
import { useCurrentUserAvatar } from '../hooks/useUserAvatar';
import UserManagement from './UserManagement';


export function ProductMenu() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const open = Boolean(anchor)


    const instances = useAtomValue(productInstancesAtom)
    const selectedInstance = useAtomValue(selectedProductInstanceAtom)
    const props = useCurrentUserAvatar()

    const handleClose = () => setAnchor(null)
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => { setAnchor(e.currentTarget) }
    const color = (inst: ProductInstance) => (inst.id == selectedInstance?.id ? 'primary.main' : undefined)


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
                {instances.map(i => (
                    <MenuItem key={i.id}>
                        <ListItemText primary={i.productName} secondary={i.id} sx={{ color: color(i) }} />
                    </MenuItem>
                ))}
                <UserManagement />
                <LogoutMenuEntry />
            </Menu>
        </>


    )
}