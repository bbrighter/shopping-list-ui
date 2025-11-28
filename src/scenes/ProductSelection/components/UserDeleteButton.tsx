import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteUserAtom, userNameAtom, type User } from '../../../store/authStore';
import { useAtomValue, useSetAtom } from 'jotai';

export default function UserDeleteButton(props: { user: User }) {
    const deleteUser = useSetAtom(deleteUserAtom)
    const currentUserName = useAtomValue(userNameAtom)

    return (
        <IconButton
            onClick={() => deleteUser({ userName: props.user.name })}
            disabled={props.user.name == currentUserName}
            data-testid='deleteUser'
        >
            <DeleteIcon />
        </IconButton>
    )
}