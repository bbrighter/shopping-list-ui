import { useAtomValue } from 'jotai'
import { SwipeableList, Type } from 'react-swipeable-list'

import { selectors } from '../../../store'
import { ShoppingListItem } from './ShoppingListItem'

export const ShoppingList = () => {
    const items = useAtomValue(selectors.items.withNames)

    return (
        <SwipeableList type={Type.ANDROID}>
            {items.map(it => (
                <ShoppingListItem it={it} key={it.id} />
            ))}
        </SwipeableList>
    )
}
