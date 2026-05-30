import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useSetAtom } from 'jotai'

import { updateProductsAtom } from '../../../store'

type ProductProp = { id: number, name: string, archived: boolean }

export const ProductManagementItem = (product: ProductProp) => {
    const textColor = product.archived ? 'textDisabled' : 'textPrimary'

    return (
        <ListItem
            secondaryAction={<Actions {...product} />}
        >
            <ListItemText
                disableTypography
                primary={<Typography color={textColor}>{product.name}</Typography>}
            />
        </ListItem>
    )
}

const Actions = ({ id, archived }: { id: number, archived: boolean }) => {
    const updateProduct = useSetAtom(updateProductsAtom)

    const onArchive = () => updateProduct(id, { archive: !archived })

    return (
        <ButtonGroup>
            <IconButton onClick={onArchive}>
                {archived ? <UnarchiveIcon color="disabled" /> : <ArchiveIcon />}
            </IconButton>
        </ButtonGroup>
    )
}
