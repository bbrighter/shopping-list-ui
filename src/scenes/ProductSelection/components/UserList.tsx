import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useEffect } from 'react'
import { getUsersAtom, usersAtom } from '../../../store/authStore'
import { useAtomValue, useSetAtom } from 'jotai'
import { useUserAvatar } from '../hooks/useUserAvatar'
import UserDeleteButton from './UserDeleteButton'

export default function UserList() {
    const users = useAtomValue(usersAtom)
    const getUsers = useSetAtom(getUsersAtom)
    const props = useUserAvatar

    useEffect(() => {
        getUsers()
    }, [])


    return (
        <List sx={{ pt: '1rem', pb: '1rem' }}>
            {users.map(u => (
                <ListItem key={u.id}
                    secondaryAction={<UserDeleteButton user={u} />}
                >
                    <ListItemAvatar sx={{ pr: '1rem' }}><Avatar {...props(u.name)} /></ListItemAvatar>
                    <ListItemText primary={u.name} />
                </ListItem>
            ))}
        </List>
    )
}
