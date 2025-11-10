import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { deleteItemAtom, updateItemAtom, type Item } from '../../../store/items';
import { useSetAtom } from 'jotai';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export default function ItemSecondaryAction(props: { item: Item }) {
    const [deleteLoading, setDeleteLoading] = useState(false)
    const updateItem = useSetAtom(updateItemAtom)
    const deleteItem = useSetAtom(deleteItemAtom)
    const item = props.item

    const onIncrease = () => {
        const newQuantity = item.quantity ? item.quantity + 1 : 1
        updateItem({ ...item, quantity: newQuantity })
    }
    const onDecrease = () => {
        const newQuantity = !item.quantity || item.quantity == 1 ? undefined : item.quantity - 1
        updateItem({ ...item, quantity: newQuantity })
    }

    const onDelete = async () => {
        setDeleteLoading(true)
        await deleteItem(item.id)
        setDeleteLoading(false)
    }


    const disableDecrease = item?.quantity == undefined || item?.quantity == 0

    return (
        <ButtonGroup>
            <Button
                onClick={onIncrease}
                data-testid='increaseItemQuantity'
            >+</Button>
            <Button
                onClick={onDecrease}
                disabled={disableDecrease}
                data-testid='decreaseItemQuantity'
            >-</Button>
            <Button
                sx={{ paddingLeft: 1, paddingRight: 0, margin: 0 }}
                color='error'
                onClick={onDelete}
                loading={deleteLoading}
                startIcon={<DeleteIcon />}
                data-testid='deleteItem'
            />
        </ButtonGroup>
    )
}