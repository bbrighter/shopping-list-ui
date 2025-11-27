import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteUserAtom, type User } from '../../../store/authStore';
import { useSetAtom } from 'jotai';

export default function UserDeleteButton(props: { user: User }) {
    const deleteUser = useSetAtom(deleteUserAtom)

    return (
        <IconButton
            onClick={() => deleteUser({ userName: props.user.name })}
        >
            <DeleteIcon />
        </IconButton>
    )
}