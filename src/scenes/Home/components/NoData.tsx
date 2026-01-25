import Box from '@mui/material/Box'
import { useAtomValue } from 'jotai'

import { noItemsAtom } from '../../../store'

export const NoData = () => {
    const noItemsFound = useAtomValue(noItemsAtom)

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
