import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { fetchListAtom, fetchProducts, itemsWithNamesAtom } from '../../store'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { piidAtom } from '../../store/auth'
import Container from '@mui/material/Container'
import ItemInput from './components/ItemInput'
import ItemSecondaryAction from './components/ItemSecondaryAction'
import ItemCheckBox from './components/ItemCheckBox'
import FinishListButton from './components/FinishListButton'
import Stack from '@mui/material/Stack'

export default function Home() {
    const piid = useAtomValue(piidAtom)
    const items = useAtomValue(itemsWithNamesAtom)
    const fetchList = useSetAtom(fetchListAtom)
    const fetchProduct = useSetAtom(fetchProducts)


    useEffect(() => {
        fetchList()
        fetchProduct()
    }, [piid])

    return (
        <Container sx={{ padding: '2rem' }}>
            <Stack spacing={3}>
                <FinishListButton />
                <ItemInput />
                <List >
                    {items.map(it => (
                        <ListItem
                            key={it.id}
                            secondaryAction={<ItemSecondaryAction item={it} />}
                        >
                            <ItemCheckBox item={it} />
                            <ListItemText primary={it.productName || 'no name'} secondary={it.quantity} />
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </Container >
    )
}