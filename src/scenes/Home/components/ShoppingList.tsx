import { useAtomValue } from 'jotai'
import { SwipeableList, Type } from 'react-swipeable-list'

import { itemsWithNamesAtom } from '../../../store'
import { ShoppingListItem } from './ShoppingListItem'

export const ShoppingList = () => {
    const items = useAtomValue(itemsWithNamesAtom)

    return (
        <SwipeableList type={Type.ANDROID}>
            {items.map(it => (
                <ShoppingListItem it={it} key={it.id} />
            ))}
        </SwipeableList>
    )
}
