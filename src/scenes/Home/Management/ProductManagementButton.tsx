import SortIcon from '@mui/icons-material/Sort'
import IconButton from '@mui/material/IconButton'
import { useSetAtom } from 'jotai'

import { atoms } from '../../../store'

export const ProductManagementButton = () => {
    const setOpen = useSetAtom(atoms.products.isManagementOpen)
    const onClick = () => setOpen(true)

    return (
        <IconButton
            data-testid="management-button"
            onClick={onClick}
        >
            <SortIcon />
        </IconButton>
    )
}
