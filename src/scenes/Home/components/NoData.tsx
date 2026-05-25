import Box from '@mui/material/Box'
import { useAtomValue } from 'jotai'

import { itemsAtom, itemsLoadedAtom } from '../../../store/items/atoms'

export const NoData = () => {
    const noItemsFound = useNoDataFound()

    if (noItemsFound) {
        return (
            <Box sx={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                <Box
                    component="img"
                    sx={{ width: '50%' }}
                    src="empty-cart.svg"
                />
            </Box>
        )
    }
    else {
        return (<></>)
    }
}

const useNoDataFound = () => {
    const numberOfItems = useAtomValue(itemsAtom).length
    const loaded = useAtomValue(itemsLoadedAtom)
    return loaded && numberOfItems == 0
}
