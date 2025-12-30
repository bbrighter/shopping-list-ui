import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { useSetAtom } from 'jotai'

import { changeItemQuantityAtom, type Item } from '../../../store'

export default function ItemSecondaryAction(props: { item: Item }) {
    const updateItem = useSetAtom(changeItemQuantityAtom)
    const item = props.item

    const onIncrease = () => {
        const newQuantity = item.quantity ? item.quantity + 1 : 1
        updateItem(item.id, newQuantity)
    }
    const onDecrease = () => {
        const newQuantity = !item.quantity || item.quantity == 1 ? undefined : item.quantity - 1
        updateItem(item.id, newQuantity)
    }

    const disableDecrease = item?.quantity == undefined || item?.quantity == 0

    return (
        <ButtonGroup>
            <Button
                onClick={onIncrease}
                data-testid="increaseItemQuantity"
            >
                +
            </Button>
            <Button
                onClick={onDecrease}
                disabled={disableDecrease}
                data-testid="decreaseItemQuantity"
            >
                -
            </Button>
        </ButtonGroup>
    )
}
