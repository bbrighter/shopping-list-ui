import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useSetAtom } from 'jotai';
import { checkItemAtom, type Item } from '../../../store';

export default function ItemCheckBox(props: { item: Item }) {
    const checkItem = useSetAtom(checkItemAtom)
    const checked = props.item.checked

    return (
        <ListItemIcon >
            <Checkbox onClick={() => checkItem(props.item.id)} checked={checked} />
        </ListItemIcon>
    )
}